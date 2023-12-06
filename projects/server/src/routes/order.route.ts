import { OrderController } from '@/controllers/order.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class OrderRoute implements Routes {
  public router = Router();
  public order = new OrderController();
  public path = '/v1/order';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/find-closest-warehouse`, this.order.getClosestWarehouseWithStock);
  }
}
