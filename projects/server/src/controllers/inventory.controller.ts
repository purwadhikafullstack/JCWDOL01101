import { Inventory } from '@/interfaces/inventory.interface';
import { InventoryService } from '@/services/inventory.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class InventoryController {
  public inventory = Container.get(InventoryService);

  public getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllInventoryData: Inventory[] = await this.inventory.findAllInventory();

      res.status(200).json({ data: findAllInventoryData, message: 'find all Inventory' });
    } catch (error) {
      next(error);
    }
  };

  public getInventoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventoryId = Number(req.params.id);
      const findOneInventoryData: Inventory = await this.inventory.findInventoryById(inventoryId);

      res.status(200).json({ data: findOneInventoryData, message: 'find Inventory By Id' });
    } catch (error) {
      next(error);
    }
  };

  public createInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventoryData: Inventory = req.body;
      const createInventoryData: Inventory = await this.inventory.createInventory(inventoryData);

      res.status(201).json({ data: createInventoryData, message: 'Inventory created' });
    } catch (error) {
      next(error);
    }
  };

  public updateInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventoryId = Number(req.params.id);
      const inventoryData: Inventory = req.body;
      const updateInventoryData: Inventory = await this.inventory.updateInventory(inventoryId, inventoryData);

      res.status(200).json({ data: updateInventoryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventoryId = Number(req.params.id);
      const deleteInventoryData: Inventory = await this.inventory.deleteInventory(inventoryId);

      res.status(200).json({ data: deleteInventoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public addStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, warehouseId, stock, sizeId, notes } = req.body;
      const inventory = await this.inventory.addStock(productId, sizeId, warehouseId, stock, notes);

      res.status(200).json({ data: inventory, message: 'Stock added' });
    } catch (error) {
      next(error);
    }
  };

  public getStockByWarehouseAndProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouseId = Number(req.params.warehouseId);
      const productId = Number(req.params.productId);
      const inventoryItem = await this.inventory.getStockByWarehouseAndProduct(warehouseId, productId);

      res.status(200).json({ data: inventoryItem, message: 'Inventory item found' });
    } catch (error) {
      next(error);
    }
  };

  public getInventoryByWarehouseId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const warehouseId = Number(req.params.warehouseId);
      const findWarehouses = await this.inventory.getInventoryByWarehouseId(productId, warehouseId);

      res.status(200).json({
        message: 'get.warehouses',
        data: findWarehouses,
      });
    } catch (err) {
      next(err);
    }
  };
  public getWarehouseByInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const sizeId = Number(req.params.sizeId);
      const warehouseId = Number(req.params.warehouseId);
      const findWarehouses = await this.inventory.getWarehouseByInventoryProduct(sizeId, productId, warehouseId);

      res.status(200).json({
        message: 'get.warehouses',
        data: findWarehouses,
      });
    } catch (err) {
      next(err);
    }
  };
}
