import { ProductDto } from '@/dtos/product.dto';
import { Image } from '@/interfaces/image.interface';
import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ProductController {
  product = Container.get(ProductService);

  public getProducts = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter, limit, warehouse } = req.query;

      const { products, totalPages } = await this.product.getAllProduct({
        s: String(s),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
      });
      res.status(200).json({
        data: {
          products,
          totalPages,
        },
        message: 'get.warehouseProducts',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProductsHomepage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page);
      const s = req.query.s as string;
      const f = req.query.f as string;
      const products = await this.product.getAllProductOnHomepage({ page, s, f });
      res.status(200).json({
        data: products,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getNewestProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await this.product.getAllNewestProduct();
      res.status(200).json({
        data: products,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getHigestSellProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await this.product.getHighestSell();
      res.status(200).json({
        data: products,
        message: 'get.highest',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug);
      const proudct: Product = await this.product.getProduct(slug);
      res.status(200).json({
        data: proudct,
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
      const files = req.files as Express.Multer.File[];
      const productData: Product = await this.product.createProduct(files, {
        ...parseProduct,
        categoryId: Number(parseProduct.categoryId),
        price: Number(parseProduct.price),
        weight: Number(parseProduct.weight),
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
      const slug = String(req.params.slug);
      const product = req.body.product;
      const parseProduct: ProductDto = JSON.parse(product);
      const currentImage = JSON.parse(req.body.currentImage);
      const files = req.files as Express.Multer.File[];
      const updatedProduct = await this.product.updateProduct(slug, currentImage, files, {
        ...parseProduct,
        categoryId: Number(parseProduct.categoryId),
        price: Number(parseProduct.price),
        weight: Number(parseProduct.weight),
      });

      res.status(200).json({
        data: updatedProduct,
        message: 'product.updated',
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

  public deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageId = Number(req.params.imageId);
      const deletedImage: Image = await this.product.deleteProductImage(imageId);

      res.status(200).json({
        data: deletedImage,
        message: 'product.image.deleted',
      });
    } catch (err) {
      next(err);
    }
  };
}
