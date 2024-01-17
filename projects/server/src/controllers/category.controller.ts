import { Category } from '@/interfaces/category.interface';
import { CategoryService } from '@/services/category.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit;
      const findAllCategoryData: Category[] = await this.category.findAllCategory(Number(limit));

      res.status(200).json({ data: findAllCategoryData, message: 'find all Category' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug);
      const findOneCategoryData: Category = await this.category.findCategoryById(slug);

      res.status(200).json({ data: findOneCategoryData, message: 'find Category By Id' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.body;
      const categoryData = JSON.parse(category);
      const file = req.file as Express.Multer.File;
      const createCategoryData: Category = await this.category.createCategory(file.filename, categoryData);

      res.status(201).json({
        data: createCategoryData,
        message: 'Category created',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.body;
      const categoryData = JSON.parse(category);
      const file = req.file as Express.Multer.File;
      const image = file ? file.filename : req.body.images;

      const categoryId = Number(req.params.id);
      const updateCategoryData: Category = await this.category.updateCategory(categoryId, categoryData, image);

      res.status(200).json({
        data: updateCategoryData,
        message: 'updated',
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.id);
      const deleteCategoryData: Category = await this.category.deleteCategory(categoryId);

      res.status(200).json({ data: deleteCategoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
