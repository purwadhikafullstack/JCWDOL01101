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
    this.router.get('/api/products/home', this.product.getProductsHomepage);
    this.router.get('/api/products/new', this.product.getNewestProducts);
    this.router.get('/api/products/highest-sell', this.product.getHigestSellProducts);
    this.router.get('/api/products/:slug', this.product.getProduct);
    this.router.post('/api/products', upload.single('image'), this.product.createProduct);
    this.router.put('/api/products/:slug', upload.single('image'), this.product.updateProduct);
    this.router.patch('/api/products/delete/:productId', this.product.deleteProduct);
  }
}
