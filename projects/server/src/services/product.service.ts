import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { GetFilterProduct, Product } from '@/interfaces/product.interface';
import { Service } from 'typedi';
import { unlinkAsync } from './multer.service';
import { FindOptions, Op, literal } from 'sequelize';
import fs from 'fs';
import { ImageModel } from '@/models/image.model';
import { Image } from '@/interfaces/image.interface';

@Service()
export class ProductService {
  public async getAllProduct({ page, s, order, limit, filter }: GetFilterProduct): Promise<{ products: Product[]; totalPages: number }> {
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Product> = {
      offset,
      limit: LIMIT,
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
      ],
      where: {
        status: 'ACTIVE',
        ...(s && { name: { [Op.like]: `%${s}%` } }),
      },
      ...(!!order && { order: [[filter, order]] }),
    };

    const [findAllProduct, totalCount] = await Promise.all([DB.Product.findAll(options), DB.Product.count(options)]);
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages, products: findAllProduct };
  }

  public async getAllProductOnHomepage({ page, s, f }: { page: number; s: string; f: string }): Promise<Product[]> {
    const options: FindOptions = {
      offset: (Number(page) - 1) * 12,
      limit: 12,
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
      ],
      where: {
        status: 'ACTIVE',
        ...(s && s !== 'all' && { category: s }),
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
      default:
        options.order = [['createdAt', 'DESC']];
        break;
    }
    const products = await DB.Product.findAll(options);

    return products;
  }

  public async getHighestSell(): Promise<Product[]> {
    const currentMonth = new Date().getMonth() + 1;
    const highestSellForThisMonth: Product[] = await DB.Product.findAll({
      limit: 3,
      where: {
        status: 'ACTIVE',
      },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
      ],
      order: [[literal(`MONTH(createdAt) = ${currentMonth}`), 'DESC']],
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
      ],
      where: {
        status: 'ACTIVE',
      },
      order: [['createdAt', 'DESC']],
    });

    return findAllProduct;
  }

  public async getProduct(slug: string): Promise<Product> {
    const findProduct: Product = await DB.Product.findOne({
      where: { slug },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
        },
      ],
    });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    return findProduct;
  }

  public getStockAndCapacity = () => {
    //
  };

  public async createProduct(files: Express.Multer.File[], productData: ProductDto): Promise<Product> {
    const { name } = productData;
    const slug = name
      .toLocaleLowerCase()
      .replace(/^a-z0-9\s/g, '')
      .replace(/\s+/g, '-');
    const [product, created] = await DB.Product.findOrCreate({
      where: { name },
      defaults: { ...productData, slug },
    });
    if (!created) throw new HttpException(409, 'Product already exist');

    const imageData = files.map(file => ({ image: file.filename, productId: product.id }));
    await DB.Image.bulkCreate(imageData);

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
      .replace(/^a-z0-9\s/g, '')
      .replace(/\s+/g, '-');
    await DB.Product.update({ ...productData, slug: newSlug }, { where: { slug } });
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
