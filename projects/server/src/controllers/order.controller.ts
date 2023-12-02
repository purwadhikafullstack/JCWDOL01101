import { OrderService } from '@/services/order.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class OrderController {
  order = Container.get(OrderService);

  public getClosestWarehouseWithStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lat = Number(req.body.lat);
      const lng = Number(req.body.lng);
      const closestWarehouse = await this.order.findClosestWarehouseWithStock({ lat, lng });

      res.status(200).json({
        data: closestWarehouse,
        message: 'post.closest',
      });
    } catch (err) {
      next(err);
    }
  };
}
