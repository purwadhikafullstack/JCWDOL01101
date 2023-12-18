import { InventoryService } from '@/services/inventrory.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class InventoryController {
  inventory = Container.get(InventoryService);

  public getWarehouseByInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.query.productId);
      const warehouseId = Number(req.query.warehouseId);
      const findWarehouses = await this.inventory.getWarehouseByInventoryProduct(productId, warehouseId);

      res.status(200).json({
        message: 'get.warehouses',
        data: findWarehouses,
      });
    } catch (err) {
      next(err);
    }
  };
}
