import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CategoryController } from '@/controllers/category.controller';
import { upload } from '@/services/multer.service';

export class CategoryRoute implements Routes {
  public path = '/v1/categories';
  public router = Router();
  public category = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.category.getCategory);
    this.router.get(`${this.path}/:slug`, this.category.getCategoryById);
    this.router.post(`${this.path}`, upload.single('images'), this.category.createCategory);
    this.router.put(`${this.path}/:id(\\d+)`, upload.single('images'), this.category.updateCategory);
    this.router.delete(`${this.path}/:id(\\d+)`, this.category.deleteCategory);
  }
}
