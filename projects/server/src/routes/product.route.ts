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
    this.router.post('/api/product', upload.single('image'), this.product.createProduct);
    this.router.put('/api/product/:productId', this.product.deleteProduct);
  }
}
