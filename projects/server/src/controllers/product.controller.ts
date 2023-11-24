import { ProductDto } from '@/dtos/product.dto';
import { GetFilterProduct, Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ProductController {
  product = Container.get(ProductService);

  public getProducts = async (req: Request<{}, {}, {}, GetFilterProduct>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter } = req.query;
      const { products, totalPages } = await this.product.getAllProduct({
        s,
        order,
        filter,
        page: Number(page),
      });
      res.status(200).json({
        data: {
          products,
          totalPages,
        },
        message: 'get.products',
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
      const slug = String(req.params.slug);
      const { product } = req.body;
      const parseProduct: ProductDto = JSON.parse(product);
      let image = parseProduct.image;
      if (!Boolean(image)) {
        const { path } = req.file as Express.Multer.File;
        image = path;
      }
      const updatedProduct = await this.product.updateProduct(slug, {
        ...parseProduct,
        image,
        categoryId: Number(parseProduct.categoryId),
        price: Number(parseProduct.price),
        stock: Number(parseProduct.stock),
        weight: Number(parseProduct.weight),
      });

      res.status(200).json({
        data: updatedProduct,
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
