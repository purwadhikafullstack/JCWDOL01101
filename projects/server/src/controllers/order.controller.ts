import { Order } from '@/interfaces/order.interface';
import { OrderService } from '@/services/order.service';
import { OrderMutationService } from '@/services/orderMutation.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class OrderController {
  public order = Container.get(OrderService);
  public orderMutation = Container.get(OrderMutationService);

  public getOrderDetailsByOrderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const orderDetails = await this.order.getOrderDetailsByOrderId(orderId);

      res.status(200).json({ data: orderDetails, message: 'get.orderDetails' });
    } catch (error) {
      next(error);
    }
  };

  public getKpi = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const overview = await this.order.getKpi(externalId);

      res.status(200).json({ data: overview, message: 'get.overview' });
    } catch (error) {
      next(error);
    }
  };

  public getRevenue = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const revenue = await this.order.getRevenue(externalId);
      res.status(200).json({ data: revenue, message: 'get.revenue' });
    } catch (error) {
      next(error);
    }
  };

  public getTopCategory = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const topCategory = await this.order.getTopCategory(externalId);
      res.status(200).json({ data: topCategory, message: 'get.topCategory' });
    } catch (error) {
      next(error);
    }
  };

  public getHighestSellingProduct = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const highestSeller = await this.order.getHighestSellingProduct(externalId);
      res.status(200).json({ data: highestSeller, message: 'get.highestSeller' });
    } catch (error) {
      next(error);
    }
  };

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
      const { page, s, order, filter, limit, warehouse, status, to, from } = req.query;
      const { orders, totalPages, totalSuccess, totalPending, totalFailed, totalOngoing } = await this.order.getAllOrder({
        s: String(s),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
        status: String(status),
        to: new Date(String(to)),
        from: new Date(String(from)),
      });

      res.status(200).json({
        data: {
          orders,
          totalPages,
          totalSuccess,
          totalPending,
          totalFailed,
          totalOngoing,
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
      const orders: Order = await this.orderMutation.allowOrder(externalId, productId);

      res.status(200).json({ data: orders, message: 'get user order' });
    } catch (error) {
      next(error);
    }
  };

  public cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const updatedOrder = await this.orderMutation.cancelOrder(orderId);

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
      const updatedOrder = await this.orderMutation.confirmOrder(orderId);

      res.status(200).json({
        data: updatedOrder,
        message: 'order.confirmed',
      });
    } catch (err) {
      next(err);
    }
  };

  public adminAcceptOrder = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const editOrder = await this.orderMutation.adminAcceptOrder(orderId);

      res.status(200).json({ data: editOrder, message: 'patch.order' });
    } catch (error) {
      next(error);
    }
  };

  public adminRejectOrder = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const editOrder = await this.orderMutation.adminRejectOrder(orderId);

      res.status(200).json({ data: editOrder, message: 'patch.order' });
    } catch (error) {
      next(error);
    }
  };

  public adminSendOrder = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const editOrder = await this.orderMutation.adminSendOrder(orderId);

      res.status(200).json({ data: editOrder, message: 'patch.order' });
    } catch (error) {
      next(error);
    }
  };

  public adminCancelOrder = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const editOrder = await this.orderMutation.adminCancelOrder(orderId);

      res.status(200).json({ data: editOrder, message: 'patch.order' });
    } catch (error) {
      next(error);
    }
  };
}
