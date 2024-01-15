import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { WarehouseController } from '@/controllers/warehouse.controller';

export class WarehouseRoute implements Routes {
  public path = '/v1/warehouses';
  public router = Router();
  public warehouse = new WarehouseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.warehouse.getWarehouse);
    this.router.get(`${this.path}/closest/:lat/:lng`, this.warehouse.getClosestWarehouse);
    this.router.get(`${this.path}/:id`, this.warehouse.getWarehouseById);
    this.router.get(`${this.path}/user/:userId`, this.warehouse.getWarehouseByUserId);
    this.router.post(`${this.path}`, this.warehouse.createWarehouse);
    this.router.put(`${this.path}/:id(\\d+)`, this.warehouse.updateWarehouse);
    this.router.delete(`${this.path}/:id(\\d+)`, this.warehouse.deleteWarehouse);
    this.router.put(`${this.path}/:id(\\d+)/assign/:userId(\\d+)`, this.warehouse.assignAdmin);
    this.router.put(`${this.path}/unassign/:userId(\\d+)`, this.warehouse.unassignAdmin);
  }
}
