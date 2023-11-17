import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Product } from '@/interfaces/product.interface';
import { Service } from 'typedi';
import { unlinkAsync } from './multer.service';

@Service()
export class ProductService {
  public async getAllProduct(): Promise<Product[]> {
    const findAllProduct = await DB.Product.findAll({ where: { status: 'ACTIVE' } });
    return findAllProduct;
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
