import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CategoryController } from '@/controllers/category.controller';

export class CategoryRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public category = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.category.getCategory);
    this.router.get(`${this.path}/get/:id(\\d+)`, this.category.getCategoryById);
    this.router.post(`${this.path}/post`, this.category.createCategory);
    this.router.put(`${this.path}/put/:id(\\d+)`, this.category.updateCategory);
    this.router.delete(`${this.path}/delete/:id(\\d+)`, this.category.deleteCategory);
  }
}

