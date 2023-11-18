import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { WarehouseController } from '@/controllers/warehouse.controller';

export class WarehouseRoute implements Routes {
  public path = '/warehouses';
  public router = Router();
  public warehouse = new WarehouseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.warehouse.getWarehouse);
    this.router.get(`${this.path}/get/:id(\\d+)`, this.warehouse.getWarehouseById);
    this.router.post(`${this.path}/post`, this.warehouse.createWarehouse);
    this.router.put(`${this.path}/put/:id(\\d+)`, this.warehouse.updateWarehouse);
    this.router.delete(`${this.path}/delete/:id(\\d+)`, this.warehouse.deleteWarehouse);
  }
}

