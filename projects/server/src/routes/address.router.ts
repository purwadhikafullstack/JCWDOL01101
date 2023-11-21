import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AddressController } from '@/controllers/address.controller';

export class AddressRoute implements Routes {
  public path = '/api/addresses';
  public router = Router();
  public address = new AddressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.address.getAddress);
    this.router.get(`${this.path}/get/:id(\\d+)`, this.address.getAddressById);
    this.router.post(`${this.path}/post`, this.address.createAddress);
    this.router.put(`${this.path}/put/:id(\\d+)`, this.address.updateAddress);
    this.router.delete(`${this.path}/delete/:id(\\d+)`, this.address.deleteAddress);
  }
}

