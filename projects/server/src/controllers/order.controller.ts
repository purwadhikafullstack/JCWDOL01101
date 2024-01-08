import { Order } from '@/interfaces/order.interface';
import { OrderService } from '@/services/order.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class OrderController {
  public order = Container.get(OrderService);

  public getOrder = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const orders: Order[] = await this.order.findOrder(userId);

      res.status(200).json({ data: orders, message: 'get all current user order' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUserOrders = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const status = String(req.query.status);
      const page = Number(req.query.page);
      const q = String(req.query.q);
      const limit = Number(req.query.limit);

      const { orders, totalPages } = await this.order.findCurrentUserOrder({ externalId, status, page, q, limit });

      res.status(200).json({
        data: {
          orders,
          totalPages,
        },
        message: 'get Current User Order',
      });
    } catch (error) {
      next(error);
    }
  };

  public getOrders = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter, limit, warehouse, status } = req.query;

      const { orders, totalPages } = await this.order.getAllOrder({
        s: String(s),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
        status: String(status),
      });
      res.status(200).json({
        data: {
          orders,
          totalPages,
        },
        message: 'get.orders',
      });
    } catch (err) {
      next(err);
    }
  };

  public getAllowOrders = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const productId = Number(req.params.productId);
      const orders: Order = await this.order.allowOrder(externalId, productId);

      res.status(200).json({ data: orders, message: 'get user order' });
    } catch (error) {
      next(error);
    }
  };

  public cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const updatedOrder = await this.order.cancelOrder(orderId);
  
      res.status(200).json({
        data: updatedOrder,
        message: 'order.cancelled',
      });
    } catch (err) {
      next(err);
    }
  };

  public confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const updatedOrder = await this.order.confirmOrder(orderId);
  
      res.status(200).json({
        data: updatedOrder,
        message: 'order.confirmed',
      });
    } catch (err) {
      next(err);
    }
  };
}
