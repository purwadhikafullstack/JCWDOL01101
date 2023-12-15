import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { SizeController } from '@/controllers/size.controller';

export class SizeRoute implements Routes {
  public path = '/v1/size';
  public router = Router();
  public size = new SizeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.size.getSize);
  }
}
