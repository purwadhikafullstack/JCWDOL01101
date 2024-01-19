import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Category } from '@/interfaces/category.interface';
import { InventoryModel } from '@/models/inventory.model';
import { ProductModel } from '@/models/product.model';
import { FindOptions } from 'sequelize';
import { Service } from 'typedi';
import fs from 'fs';
import { unlinkAsync } from './multer.service';

@Service()
export class CategoryService {
  public async findAllCategory(limit?: number): Promise<Category[]> {
    const opts: FindOptions<Category> = {
      paranoid: true,
    };
    if (limit) {
      opts.limit = limit;
      opts.include = [
        {
          model: ProductModel,
          as: 'productCategory',
          include: [
            {
              model: InventoryModel,
              as: 'inventory',
              attributes: ['sold'],
            },
          ],
        },
      ];
      opts.order = [
        [
          DB.Sequelize.literal(`(
       SELECT SUM(inventory.sold) FROM products AS product
      INNER JOIN inventories AS inventory ON product.id = inventory.product_id
      WHERE product.category_id = CategoryModel.id
      )`),
          'DESC',
        ],
      ];
    }
    const allCategory: Category[] = await DB.Categories.findAll(opts);
    return allCategory;
  }

  public async findCategoryById(slug: string): Promise<Category> {
    const findCategory: Category = await DB.Categories.findOne({ where: { slug } });
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    return findCategory;
  }

  public async createCategory(image: string, categoryData: Category): Promise<Category> {
    const findCategory: Category = await DB.Categories.findOne({ where: { name: categoryData.name } });
    if (findCategory) throw new HttpException(409, 'Category already exist');

    const slug = categoryData.name
      .toLocaleLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '-');
    const createCategoryData: Category = await DB.Categories.create({ slug, image, name: categoryData.name });
    return createCategoryData;
  }

  public async updateCategory(categoryId: number, categoryData: Category, image: string): Promise<Category> {
    const findCategory: Category = await DB.Categories.findByPk(categoryId);
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    const newSlug = categoryData.name
      .toLocaleLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '-');
    if (findCategory.image !== image) {
      fs.access(`uploads/${findCategory.image}`, fs.constants.F_OK, err => {
        if (!err) {
          unlinkAsync(`uploads/${findCategory.image}`);
        }
      });
    }
    await DB.Categories.update({ image, slug: newSlug, name: categoryData.name }, { where: { id: categoryId } });
    const updateCategory: Category = await DB.Categories.findByPk(categoryId);
    return updateCategory;
  }

  public async deleteCategory(categoryId: number): Promise<Category> {
    const findCategory: Category = await DB.Categories.findByPk(categoryId);
    if (!findCategory) throw new HttpException(409, "Category doesn't exist");

    await DB.Categories.destroy({ where: { id: categoryId } });

    return findCategory;
  }
}
