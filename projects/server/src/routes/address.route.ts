import { AdressController } from '@/controllers/address.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class AddressRoute implements Routes {
  public router = Router();
  public address = new AdressController();
  public path = '/api/address';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/current/:lat/:lng`, this.address.getCurrentLocation);
  }
}
