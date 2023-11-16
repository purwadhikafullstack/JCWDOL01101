import { Router } from 'express';
// import { UserController } from '@controllers/users.controller';
// import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
// import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { WarehouseController } from '@/controllers/warehouses.controller';

export class WarehouseRoute implements Routes {
  public path = '/warehouses';
  public router = Router();
  public warehouse = new WarehouseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.warehouse.getWarehouse);
    this.router.get(`${this.path}/:id(\\d+)`, this.warehouse.getWarehouseById);
    this.router.post(`${this.path}`, this.warehouse.createWarehouse);
    // this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser);
  }
}

