import { ProductDto } from '@/dtos/product.dto';
import { Service } from 'typedi';
import { createProduct } from './createProduct';
import { Inventory, Image, Product, Status, GetFilterProduct, Review } from '@/interfaces';
import { deleteProductImage } from './deleteProductImage';
import { readProducts } from './readProducts';
import { ProductQuery } from '@/controllers/product.controller';
import { readHomepageProducts } from './readHomepageProducts';
import { readNewestProducts } from './readNewestproducts';
import { readHighestSoldProducts } from './readHighestSoldProducts';
import { readProductsByCategory } from './readProductsByCategory';
import { ProductBySlug, readProductBySlug } from './readProductBySlug';
import { readProductsByName } from './readProductByName';
import { updateProduct, updateProductInventoryStatus, updateProductStatus } from './updateProduct';

@Service()
export class ProductService {
  public async createProduct(files: Express.Multer.File[], productData: ProductDto): Promise<Product> {
    return createProduct(files, productData);
  }

  public async updateProduct(
    slug: string,
    currentImage: { imageId: number; file: Express.Multer.File }[],
    files: Express.Multer.File[],
    productData: ProductDto,
  ): Promise<Product> {
    return updateProduct(slug, currentImage, files, productData);
  }

  public async updateProductStatus(productId: number, warehouseId: number | undefined, status: Status, previousStatus: Status): Promise<Product> {
    return updateProductStatus(productId, warehouseId, status, previousStatus);
  }

  public async updateProductInvetoryStatus(productId: number, warehouseId: number | undefined, status: Status): Promise<Inventory> {
    return updateProductInventoryStatus(productId, warehouseId, status);
  }

  public async deleteProductImage(imageId: number): Promise<Image> {
    return deleteProductImage(imageId);
  }

  public async getProducts(params: GetFilterProduct): Promise<{ products: Product[]; totalPages: number }> {
    return readProducts({ ...params });
  }

  public async getHomepageProducts(params: ProductQuery): Promise<Product[]> {
    return readHomepageProducts({ ...params });
  }

  public async getNewestProducts(externalId: string | undefined): Promise<Product[]> {
    return readNewestProducts(externalId);
  }

  public async getHighestSoldProducts(limit: number, externalId: string | undefined): Promise<Product[]> {
    return readHighestSoldProducts(limit, externalId);
  }

  public async getProductsByCategory(productId: number, categoryId: number, externalId: string, limit: number): Promise<Product[]> {
    return readProductsByCategory(productId, categoryId, externalId, limit);
  }

  public async getProductBySlug(slug: string, externalId: string): Promise<ProductBySlug> {
    return readProductBySlug(slug, externalId);
  }
  public async getProductsByName(name: string): Promise<Product[]> {
    return readProductsByName(name);
  }
}
