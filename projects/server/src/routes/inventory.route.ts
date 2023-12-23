import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { InventoryController } from '@/controllers/inventory.controller';

export class InventoryRoute implements Routes {
  public path = '/v1/inventories';
  public router = Router();
  public inventory = new InventoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.inventory.getInventory);
    this.router.get(`${this.path}/:id(\\d+)`, this.inventory.getInventoryById);
    this.router.post(`${this.path}`, this.inventory.createInventory);
    this.router.put(`${this.path}/:id(\\d+)`, this.inventory.updateInventory);
    this.router.delete(`${this.path}/:id(\\d+)`, this.inventory.deleteInventory);
    this.router.put(`${this.path}/modify-stock`, this.inventory.addStock);
    this.router.get(`${this.path}/:warehouseId/:productId`, this.inventory.getStockByWarehouseAndProduct);
    this.router.get(`${this.path}/warehouse/:warehouseId/product/:productId/size/:sizeId`, this.inventory.getWarehouseByInventory);
    this.router.get(`${this.path}/warehouse/:warehouseId/product/:productId`, this.inventory.getInventoryByWarehouseId);
  }
}
