import { ProductDto } from '@/dtos/product.dto';
import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ProductController {
  product = Container.get(ProductService);

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proudcts: Product[] = await this.product.getAllProduct();
      res.status(200).json({
        data: proudcts,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product } = req.body;
      const parseProduct: ProductDto = JSON.parse(product);
      const { path } = req.file as Express.Multer.File;
      const productData: Product = await this.product.createProduct({
        ...parseProduct,
        categoryId: Number(parseProduct.categoryId),
        price: Number(parseProduct.price),
        stock: Number(parseProduct.stock),
        weight: Number(parseProduct.weight),
        image: path,
      });

      res.status(200).json({
        data: productData,
        message: 'product.created',
      });
    } catch (err) {
      next(err);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product } = req.body;
      const parseProduct: ProductDto = JSON.parse(product);
      const { path } = req.file as Express.Multer.File;
      // TODO: check if image is updated, if update then delete the old image replace it with new image
      const productData: Product = await this.product.createProduct({
        ...parseProduct,
        categoryId: Number(parseProduct.categoryId),
        price: Number(parseProduct.price),
        stock: Number(parseProduct.stock),
        weight: Number(parseProduct.weight),
        image: path,
      });

      res.status(200).json({
        data: productData,
        message: 'product.created',
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const deletedProduct: Product = await this.product.deleteProduct(productId);

      res.status(200).json({
        data: deletedProduct,
        message: 'product.deleted',
      });
    } catch (err) {
      next(err);
    }
  };
}
