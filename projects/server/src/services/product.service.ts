import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { GetFilterProduct, Product } from '@/interfaces/product.interface';
import { Service } from 'typedi';
import { unlinkAsync } from './multer.service';
import { FindOptions, Op } from 'sequelize';
import { ImageModel } from '@/models/image.model';
import { Image } from '@/interfaces/image.interface';
import { User } from '@/interfaces/user.interface';
import { CategoryModel } from '@/models/category.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { InventoryModel } from '@/models/inventory.model';
import fs from 'fs';

@Service()
export class ProductService {
  public async getAllProduct({
    page,
    s,
    order,
    limit,
    filter,
    externalId,
    warehouse,
  }: GetFilterProduct): Promise<{ products: Product[]; totalPages: number }> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const role = findUser.role;
    const where =
      role === 'ADMIN'
        ? {
            ...(warehouse && { name: { [Op.like]: `%${warehouse}%` } }),
          }
        : role === 'WAREHOUSE ADMIN'
        ? {
            id: findUser.warehouseId,
          }
        : {};

    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Product> = {
      offset,
      limit: LIMIT,
      where: {
        status: 'ACTIVE',
        ...(s && { name: { [Op.like]: `%${s}%` } }),
      },
      ...(order && {
        order: filter === 'stock' || filter === 'sold' ? [[{ model: InventoryModel, as: 'inventory' }, filter, order]] : [[filter, order]],
      }),
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: CategoryModel,
          as: 'productCategory',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
          include: [
            {
              where,
              model: WarehouseModel,
              as: 'warehouse',
            },
          ],
        },
      ],
    };

    const warehouseProducts = await DB.Product.findAll(options);
    const totalCount = await DB.Product.count(options);
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages: totalPages, products: warehouseProducts };
  }

  public async getAllProductOnHomepage({ page, f, category }: { page: number; f: string; category: number }): Promise<Product[]> {
    const options: FindOptions = {
      offset: (Number(page) - 1) * 12,
      limit: 12,
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
      ],
      where: {
        status: 'ACTIVE',
        ...(category && { categoryId: category }),
      },
    };

    switch (f) {
      case 'newest':
        options.order = [['createdAt', 'DESC']];
        break;
      case 'lth':
        options.order = [['price', 'ASC']];
        break;
      case 'htl':
        options.order = [['price', 'DESC']];
        break;
      case 'hs':
        options.order = [[{ model: InventoryModel, as: 'inventory' }, 'sold', 'DESC']];
        break;
      default:
        options.order = [['createdAt', 'DESC']];
        break;
    }
    const products = await DB.Product.findAll(options);

    return products;
  }

  public async getHighestSell(): Promise<Product[]> {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const highestSellForThisMonth: Product[] = await DB.Product.findAll({
      limit: 3,
      where: {
        status: 'ACTIVE',
        createdAt: {
          [Op.gte]: firstDayOfMonth,
          [Op.lte]: lastDayOfMonth,
        },
      },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
      ],
      order: [[{ model: InventoryModel, as: 'inventory' }, 'sold', 'DESC']],
    });

    return highestSellForThisMonth;
  }

  public async getAllNewestProduct(): Promise<Product[]> {
    const findAllProduct: Product[] = await DB.Product.findAll({
      limit: 12,
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: CategoryModel,
          as: 'productCategory',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
      ],
      where: {
        status: 'ACTIVE',
      },
      order: [['createdAt', 'DESC']],
    });

    return findAllProduct;
  }
  public async getProductByName(s: string): Promise<Product[]> {
    const findProducts: Product[] = await DB.Product.findAll({
      where: { ...(s && { name: { [Op.like]: `%${s}%` } }) },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
      ],
    });

    return findProducts || [];
  }

  public async getProduct(slug: string): Promise<Product> {
    const findProduct: Product = await DB.Product.findOne({
      where: { slug },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
      ],
    });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    return findProduct;
  }

  public async createProduct(files: Express.Multer.File[], productData: ProductDto): Promise<Product> {
    const { name } = productData;

    const slug = name
      .toLocaleLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '-');
    const [product, created] = await DB.Product.findOrCreate({
      where: { name },
      defaults: { ...productData, slug },
    });
    if (!created) throw new HttpException(409, 'Product already exist');

    const imageData = files.map(file => ({ image: file.filename, productId: product.id }));
    const images: Image[] = await DB.Image.bulkCreate(imageData);

    const primaryImage = images[0]?.image;
    if (primaryImage) {
      await DB.Product.update({ primaryImage }, { where: { id: product.id } });
    }

    const findAllWarehouse = await DB.Warehouses.findAll();
    if (!findAllWarehouse && findAllWarehouse.length === 0) throw new HttpException(409, 'No Warehouse');

    const warehouses = findAllWarehouse.map(warehouse => ({ warehouseId: warehouse.id, productId: product.id }));
    await DB.Inventories.bulkCreate(warehouses);

    return product;
  }

  public async updateProduct(
    slug: string,
    currentImage: { imageId: number; file: Express.Multer.File }[],
    files: Express.Multer.File[],
    productData: ProductDto,
  ): Promise<Product> {
    const findProduct: Product = await DB.Product.findOne({ where: { slug } });
    if (!findProduct) throw new HttpException(409, "Product doesn't already exist");

    if (files.length > 0) {
      for (let i = 0; i < currentImage.length; i++) {
        const imageId = currentImage[i].imageId;
        if (imageId) {
          const image: Image = await DB.Image.findByPk(Number(imageId));
          await DB.Image.update({ image: files[i].filename }, { where: { id: Number(imageId) } });
          fs.access(`uploads/${image.image}`, fs.constants.F_OK, err => {
            if (!err) {
              unlinkAsync(`uploads/${image.image}`);
            }
          });
        } else {
          await DB.Image.create({ image: files[i].filename, productId: findProduct.id });
        }
      }
    }

    const newSlug = productData.name
      .toLocaleLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '-');
    const images: Image[] = await DB.Image.findAll({ where: { productId: findProduct.id } });
    if (!images || images.length === 0) throw new HttpException(409, 'No image');
    await DB.Product.update({ ...productData, slug: newSlug, primaryImage: images[0].image }, { where: { slug } });
    const updatedProduct: Product = await DB.Product.findOne({ where: { slug: newSlug } });
    return updatedProduct;
  }

  public async deleteProductImage(imageId: number) {
    const findProductImage = await DB.Image.findByPk(imageId);
    if (!findProductImage) throw new HttpException(409, "Image doesn't exist");

    await DB.Image.destroy({ where: { id: imageId } });
    fs.access(`uploads/${findProductImage.image}`, fs.constants.F_OK, err => {
      if (!err) {
        unlinkAsync(`uploads/${findProductImage.image}`);
      }
    });
    const images: Image[] = await DB.Image.findAll({ where: { productId: findProductImage.productId } });
    if (!images || images.length === 0) throw new HttpException(409, 'No image');
    await DB.Product.update({ primaryImage: images[0].image }, { where: { id: findProductImage.productId } });
    return findProductImage;
  }

  public async deleteProduct(productId: number): Promise<Product> {
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    const images = await DB.Image.findAll({ where: { productId } });
    try {
      images.forEach(({ image }) => {
        fs.access(`uploads/${image}`, fs.constants.F_OK, err => {
          if (!err) {
            unlinkAsync(`uploads/${image}`);
          }
        });
      });
      await DB.Image.destroy({ where: { productId } });
      await DB.CartProduct.update({ status: 'DELETED' }, { where: { productId } });
      await DB.Product.update({ status: 'DELETED' }, { where: { id: productId } });

      return findProduct;
    } catch (err) {
      throw new HttpException(500, 'Something went wrong');
    }
  }
}
