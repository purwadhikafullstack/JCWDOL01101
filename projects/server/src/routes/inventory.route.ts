import { InventoryController } from '@/controllers/inventory.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class InventoryRoute implements Routes {
  router = Router();
  inventory = new InventoryController();
  auth = new AuthMiddleware();
  path = '/v1/inventory';

  constructor() {
    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.router.get(`${this.path}`, this.auth.ClerkAuth, this.inventory.getInventory);
  }
}
