import { InventoryController } from '@/controllers/inventory.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class InventoryRoute implements Routes {
  public router = Router();
  public inventory = new InventoryController();
  public path = '/v1/inventory';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/warehouse`, this.inventory.getWarehouseByInventory);
  }
}
