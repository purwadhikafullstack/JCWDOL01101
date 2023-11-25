import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CityController } from '@/controllers/city.controller';

export class CityRoute implements Routes {
  public path = '/api/cities';
  public router = Router();
  public City = new CityController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.City.getCity);
    this.router.get(`${this.path}/get/:id(\\d+)`, this.City.getCityById);
  }
}

