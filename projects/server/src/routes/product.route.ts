import { ProductController } from '@/controllers/product.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { upload } from '@/services/multer.service';
import { Router } from 'express';

export class ProductRoute implements Routes {
  router = Router();
  product = new ProductController();
  auth = new AuthMiddleware();
  path = '/v1/products';

  constructor() {
    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.router.get(`${this.path}`, this.auth.ClerkAuth, this.product.getProducts);
    this.router.get(`${this.path}/home`, this.product.getProductsHomepage);
    this.router.get(`${this.path}/new`, this.product.getNewestProducts);
    this.router.get(`${this.path}/highest-sell`, this.product.getHigestSellProducts);
    this.router.get(`${this.path}/:slug`, this.product.getProduct);
    this.router.delete(`${this.path}/images/:imageId`, this.product.deleteProductImage);
    this.router.post(`${this.path}`, upload.array('images', 5), this.product.createProduct);
    this.router.put(`${this.path}/:slug`, upload.array('images', 5), this.product.updateProduct);
    this.router.patch(`${this.path}/delete/:productId`, this.product.deleteProduct);
  }
}
