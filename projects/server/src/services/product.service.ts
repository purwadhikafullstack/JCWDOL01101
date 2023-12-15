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
import { WishlistModel } from '@/models/wishlist.model';
import { Category } from '@/interfaces/category.interface';
import { ProductQuery } from '@/controllers/product.controller';
import { ReviewModel } from '@/models/review.model';

@Service()
export class ProductService {
  public async getAllProduct({
    page,
    s,
    order,
    limit,
    filter,
    category,
    warehouse,
    externalId,
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
            userId: findUser.id,
          }
          : {};

    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const categories =
      category.length > 0
        ? category
          .trim()
          .split(',')
          .map(c => +c)
        : [];
    const options: FindOptions<Product> = {
      offset,
      limit: LIMIT,
      where: {
        status: 'ACTIVE',
        ...(s && { name: { [Op.like]: `%${s}%` } }),
        ...(categories.length > 0 && {
          categoryId: {
            [Op.in]: categories,
          },
        }),
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: CategoryModel,
          as: 'productCategory',
          paranoid: true,
        },
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
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

    if (order) {
      options.order = filter === 'stock' || filter === 'sold' ? [[{ model: InventoryModel, as: 'inventory' }, filter, order]] : [[filter, order]];
    }

    const warehouseProducts = await DB.Product.findAll(options);
    const totalCount = await DB.Product.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages: totalPages, products: warehouseProducts };
  }

  public async getAllProductOnHomepage({ page, f, category, size, pmin, pmax }: ProductQuery): Promise<Product[]> {
    const findCategory: Category = await DB.Categories.findOne({ paranoid: true, where: { slug: category } });

    const where: { [k: string]: any } = {
      status: 'ACTIVE',
    };

    if (size) {
      where.size = size;
    }

    if (pmin && !Number.isNaN(+pmin)) {
      where.price = where.price || {};
      where.price[Op.gte] = Number(pmin);
    }

    if (pmax && !Number.isNaN(+pmax)) {
      where.price = where.price || {};
      where.price[Op.lte] = Number(pmax);
    }

    if (findCategory) {
      where.categoryId = findCategory.id;
    }

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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
        },
        {
          model: ReviewModel,
          as: 'productReviews',
        },
      ],
      where: where,
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
      case 'rating':
        options.order = [[{ model: ReviewModel, as: 'productReviews' }, 'rating', 'DESC']];
        break;
      default:
        options.order = [['createdAt', 'DESC']];
        break;
    }

    const products = await DB.Product.findAll(options);

    return products;
  }

  public async getHighestSell(limit: number): Promise<Product[]> {
    limit = limit || 3;
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const highestSellForThisMonth: Product[] = await DB.Product.findAll({
      limit,
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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
        },
      ],
    });

    return findProducts || [];
  }

  public async getProductsByCategory(categoryId: number, limit: number): Promise<Product[]> {
    limit = limit || 12;
    const findProducts: Product[] = await DB.Product.findAll({
      limit,
      where: { categoryId, status: 'ACTIVE' },
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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
        },
      ],
    });
    if (!findProducts || findProducts.length === 0) throw new HttpException(409, "Products doesn't exist");

    return findProducts;
  }

  public async getProduct(slug: string): Promise<{ totalStock: number; totalSold: number; product: Product }> {
    const findProduct: Product = await DB.Product.findOne({
      where: { slug, status: 'ACTIVE' },
      include: [
        {
          model: CategoryModel,
          as: 'productCategory',
          paranoid: true,
        },
        {
          model: ImageModel,
          as: 'productImage',
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
        },
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
        },
      ],
    });

    const totalStock = await DB.Inventories.sum('stock', { where: { productId: findProduct.id } });
    const totalSold = await DB.Inventories.sum('sold', { where: { productId: findProduct.id } });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    return { totalStock, totalSold, product: findProduct };
  }

  public async getProductByCategory(productId: number, categoryId: number, limit: number): Promise<Product[]> {
    limit = limit || 12;
    const findProducts: Product[] = await DB.Product.findAll({
      limit,
      where: {
        categoryId,
        id: {
          [Op.ne]: productId,
        },
        status: 'ACTIVE',
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
        {
          model: WishlistModel,
          as: 'productWishlist',
          paranoid: true,
          limit: 1,
        },
      ],
    });

    return findProducts || [];
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
