import { ProductDto } from '@/dtos/product.dto';
import { OrderDetails, Status } from '@/interfaces';
import { Image } from '@/interfaces/image.interface';
import { Inventory } from '@/interfaces/inventory.interface';
import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product/index.service';
import { RequireAuthProp, WithAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
export type ProductQuery = {
  f: string;
  page: number;
  size: string;
  pmax: string;
  pmin: string;
  category: string;
  externalId: string;
};
export class ProductController {
  product = Container.get(ProductService);

  public getProducts = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, size, order, status, filter, limit, warehouseId, category } = req.query;
      const { products, totalPages } = await this.product.getProducts({
        s: String(s),
        size: String(size),
        order: String(order),
        limit: Number(limit),
        page: Number(page),
        status: String(status),
        filter: String(filter),
        warehouse: Number(warehouseId),
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

  public getHomepageProducts = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as ProductQuery;
      const products = await this.product.getHomepageProducts({ ...query, externalId: req.auth.userId });
      res.status(200).json({
        data: products,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getNewestProducts = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await this.product.getNewestProducts(req.auth.userId);
      res.status(200).json({
        data: products,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getHigestSellProducts = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const products: OrderDetails[] = await this.product.getHighestSoldProducts(limit);
      res.status(200).json({
        data: products,
        message: 'get.highest',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProductsByCategory = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.categoryId);
      const productId = Number(req.params.productId);
      const limit = Number(req.query.limit);
      const proudcts: Product[] = await this.product.getProductsByCategory(productId, categoryId, req.auth.userId, limit);

      res.status(200).json({
        data: proudcts,
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProductBySlug = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug);
      const { product, totalStock, totalSold, totalStockBySize } = await this.product.getProductBySlug(slug, req.auth.userId);
      res.status(200).json({
        data: { product, totalStock, totalSold, totalStockBySize },
        message: 'get.products',
      });
    } catch (err) {
      next(err);
    }
  };

  public getProductsByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = String(req.query.search);
      const proudct: Product[] = await this.product.getProductsByName(search);
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
      const warehouseId = Number(req.body.warehouseId);
      const changeProductStatus: Product = await this.product.updateProductStatus(productId, warehouseId, status, previousStatus);

      res.status(200).json({
        data: changeProductStatus,
        message: 'change product status',
      });
    } catch (err) {
      next(err);
    }
  };

  public patchAllProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = String(req.body.status) as Status;
      const previousStatus = String(req.body.previousStatus) as Status;
      const warehouseId = Number(req.params.warehouseId);
      await this.product.updateAllProductStatus(warehouseId, status, previousStatus);

      res.status(200).json({
        message: 'change all product status',
      });
    } catch (err) {
      next(err);
    }
  };

  public changeProductInventoryStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const warehouseId = Number(req.body.warehouseId);
      const status = String(req.body.status) as Status;
      const inventory: Inventory = await this.product.updateProductInvetoryStatus(productId, warehouseId, status);

      res.status(200).json({
        data: inventory,
        message: 'change inventory status',
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
