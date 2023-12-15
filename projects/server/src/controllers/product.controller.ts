import { ProductDto } from '@/dtos/product.dto';
import { Status } from '@/interfaces';
import { Image } from '@/interfaces/image.interface';
import { Inventory } from '@/interfaces/inventory.interface';
import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
export type ProductQuery = {
  f: string;
  page: number;
  size: string;
  pmax: string;
  pmin: string;
  category: string;
};
export class ProductController {
  product = Container.get(ProductService);

  public getProducts = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, size, order, status, filter, limit, warehouse, category } = req.query;

      const { products, totalPages } = await this.product.getAllProduct({
        s: String(s),
        size: String(size),
        order: String(order),
        limit: Number(limit),
        page: Number(page),
        status: String(status),
        filter: String(filter),
        warehouse: Number(warehouse),
        externalId: req.auth.userId,
        category: String(category),
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

  public getProductsHomepage = async (req: Request<{}, {}, {}, ProductQuery>, res: Response, next: NextFunction) => {
    try {
      const products = await this.product.getAllProductOnHomepage({ ...req.query });
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
      const limit = Number(req.query.limit);
      const products: Product[] = await this.product.getHighestSell(limit);
      res.status(200).json({
        data: products,
        message: 'get.highest',
      });
    } catch (err) {
      next(err);
    }
  };
  public getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.categoryId);
      const productId = Number(req.params.productId);
      const limit = Number(req.query.limit);
      const proudcts: Product[] = await this.product.getProductByCategory(productId, categoryId, limit);

      res.status(200).json({
        data: proudcts,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug);
      const { product, totalStock, totalSold } = await this.product.getProduct(slug);
      res.status(200).json({
        data: { product, totalStock, totalSold },
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProductByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = String(req.query.search);
      const proudct: Product[] = await this.product.getProductByName(search);
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

  public changeProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const status = String(req.body.status) as Status;
      const previousStatus = String(req.body.previousStatus) as Status;
      const warehouseBody = Number(req.body.warehouseId);
      const warehouseId = !Number.isNaN(warehouseBody) ? warehouseBody : undefined;
      const deletedProduct: Product = await this.product.changeProductStatus(productId, warehouseId, status, previousStatus);

      res.status(200).json({
        data: deletedProduct,
        message: 'product.deleted',
      });
    } catch (err) {
      next(err);
    }
  };

  public changeProductInventoryStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const warehouseId = Number(req.params.warehouseId);
      const status = String(req.body.status) as Status;
      const deletedInventory: Inventory = await this.product.changeProductInventoryStatus(productId, warehouseId, status);

      res.status(200).json({
        data: deletedInventory,
        message: 'inventory.deleted',
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
