import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ProvinceController } from '@/controllers/province.controller';

export class ProvinceRoute implements Routes {
  public path = '/v1/provinces';
  public router = Router();
  public Province = new ProvinceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.Province.getProvince);
    this.router.get(`${this.path}/:id(\\d+)`, this.Province.getProvinceById);
  }
}
