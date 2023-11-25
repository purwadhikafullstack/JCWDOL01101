import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { WarehouseAddressController } from '@/controllers/warehouseAddressModel.controller';

export class WarehouseAddressRoute implements Routes {
  public path = '/api/warehouseAddresses';
  public router = Router();
  public warehouseAddress = new WarehouseAddressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.warehouseAddress.getWarehouseAddress);
    this.router.get(`${this.path}/:id(\\d+)`, this.warehouseAddress.getWarehouseAddressById);
    this.router.post(`${this.path}`, this.warehouseAddress.createWarehouseAddress);
    this.router.put(`${this.path}/:id(\\d+)`, this.warehouseAddress.updateWarehouseAddress);
    this.router.delete(`${this.path}/:id(\\d+)`, this.warehouseAddress.deleteWarehouseAddress);
  }
}

