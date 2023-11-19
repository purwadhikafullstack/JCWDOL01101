import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Product } from '@/interfaces/product.interface';
import { Service } from 'typedi';
import { unlinkAsync } from './multer.service';
import { FindOptions, Op, literal } from 'sequelize';

type ProductsOptions = {
  offset: number;
  limit: number;
  where: {
    status: string;
    name?: {
      [Op.like]: string;
    };
  };
};

@Service()
export class ProductService {
  public async getAllProduct({ page, s }: { page: number; s: string }): Promise<{ products: Product[]; totalPages: number }> {
    const PER_PAGE = 10;
    const offset = (page - 1) * PER_PAGE;
    const options: ProductsOptions = {
      offset,
      limit: PER_PAGE,
      where: {
        status: 'ACTIVE',
        ...(s && { name: { [Op.like]: `%${s}%` } }),
      },
    };

    const [findAllProduct, totalCount] = await Promise.all([DB.Product.findAll(options), DB.Product.count(options)]);
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    return { totalPages, products: findAllProduct };
  }

  public async getAllProductOnHomepage({ s, f }: { s: string; f: string }): Promise<Product[]> {
    const options: FindOptions = {
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
      order: [
        ['sold', 'DESC'],
        [literal(`MONTH(createdAt) = ${currentMonth}`), 'DESC'],
      ],
    });

    return highestSellForThisMonth;
  }

  public async getAllNewestProduct(): Promise<Product[]> {
    const findAllProduct: Product[] = await DB.Product.findAll({
      limit: 12,
      where: {
        status: 'ACTIVE',
      },
      order: [['createdAt', 'DESC']],
    });

    return findAllProduct;
  }

  public async getProduct(productId: number): Promise<Product> {
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't already exist");

    return findProduct;
  }

  public async createProduct(productData: ProductDto): Promise<Product> {
    const findProduct: Product = await DB.Product.findOne({ where: { name: productData.name } });
    if (findProduct) throw new HttpException(409, 'Product already exist');

    const product: Product = await DB.Product.create({ ...productData });
    return product;
  }

  public async updateProduct(productId: number, productData: ProductDto): Promise<Product> {
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't already exist");

    if (productData.image !== findProduct.image) {
      unlinkAsync(findProduct.image);
    }
    await DB.Product.update({ ...productData }, { where: { id: productId } });
    const updatedProduct: Product = await DB.Product.findByPk(productId);
    return updatedProduct;
  }

  public async deleteProduct(productId: number): Promise<Product> {
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't already exist");

    unlinkAsync(findProduct.image);
    await DB.Product.update({ status: 'DELETED' }, { where: { id: productId } });
    return findProduct;
  }
}
