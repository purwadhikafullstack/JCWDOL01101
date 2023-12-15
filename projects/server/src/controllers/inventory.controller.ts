import { InventoryService } from '@/services/inventory.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class InventoryController {
  public inventory = Container.get(InventoryService);

  public getInventory = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter, limit, warehouse, category, size } = req.query;

      const { inventories, totalPages } = await this.inventory.findInventories({
        s: String(s),
        size: String(size),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
        category: String(category),
      });
      res.status(200).json({
        data: {
          inventories,
          totalPages,
        },
        message: 'get.warehouseProducts',
      });
    } catch (err) {
      next(err);
    }
  };
}
