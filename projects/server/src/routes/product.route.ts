import { ProductController } from '@/controllers/product.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ProductValidationMiddleware, isProductExist } from '@/middlewares/validation.middleware';
import { upload } from '@/services/multer.service';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class ProductRoute implements Routes {
  router = Router();
  product = new ProductController();
  path = '/v1/products';

  constructor() {
    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.router.get(`${this.path}`, ClerkExpressWithAuth(), this.product.getProducts);
    this.router.get(`${this.path}/home`, ClerkExpressWithAuth(), this.product.getHomepageProducts);
    this.router.get(`${this.path}/:productId/category/:categoryId`, ClerkExpressWithAuth(), this.product.getProductsByCategory);
    this.router.get(`${this.path}/new`, ClerkExpressWithAuth(), this.product.getNewestProducts);
    this.router.get(`${this.path}/highest-sell`, ClerkExpressWithAuth(), this.product.getHigestSellProducts);
    this.router.get(`${this.path}/:slug`, ClerkExpressWithAuth(), this.product.getProductBySlug);
    this.router.get(`${this.path}/search/q`, this.product.getProductsByName);
    this.router.delete(`${this.path}/images/:imageId`, this.product.deleteProductImage);
    this.router.post(`${this.path}`, upload.array('images', 5), isProductExist, ProductValidationMiddleware(), this.product.createProduct);
    this.router.put(`${this.path}/:slug`, upload.array('images', 5), isProductExist, ProductValidationMiddleware(), this.product.updateProduct);
    this.router.patch(`${this.path}/status/:productId`, this.product.changeProductStatus);
    this.router.patch(`${this.path}/status/:productId/:warehouseId`, this.product.changeProductInventoryStatus);
    this.router.patch(`${this.path}/all-status/:warehouseId`, this.product.patchAllProductStatus);
  }
}
