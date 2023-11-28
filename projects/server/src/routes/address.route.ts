import { AdressController } from '@/controllers/address.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class AddressRoute implements Routes {
  public router = Router();
  public address = new AdressController();
  public path = '/v1/address';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/active`, this.address.getActiveAddress);
    this.router.get(`${this.path}/city`, this.address.getCitiesByName);
    this.router.get(`${this.path}/:addressId`, this.address.checkActiveParam, this.address.getAddressById);
    this.router.get(`${this.path}/current/:lat/:lng`, this.address.getCurrentLocation);
    this.router.get(`${this.path}`, this.address.getAllAddress);
    this.router.post(`${this.path}`, this.address.createAddress);
    this.router.put(`${this.path}/:addressId`, this.address.updateAddress);
    this.router.patch(`${this.path}/toggle/:field/:addressId`, this.address.toggleAddress);
  }
}
