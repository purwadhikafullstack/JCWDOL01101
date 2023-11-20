import { ProductController } from '@/controllers/product.controller';
import { Routes } from '@/interfaces/routes.interface';
import { upload } from '@/services/multer.service';
import { Router } from 'express';

export class ProductRoute implements Routes {
  router = Router();
  product = new ProductController();

  constructor() {
    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.router.get('/api/products', this.product.getProducts);
    this.router.get('/api/home-products', this.product.getProductsHomepage);
    this.router.get('/api/new-products', this.product.getNewestProducts);
    this.router.get('/api/highest-sell', this.product.getHigestSellProducts);
    this.router.get('/api/product/:slug', this.product.getProduct);
    this.router.post('/api/product', upload.single('image'), this.product.createProduct);
    this.router.put('/api/product/:slug', upload.single('image'), this.product.updateProduct);
    this.router.put('/api/product/delete/:productId', this.product.deleteProduct);
  }
}
