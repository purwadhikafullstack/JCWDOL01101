import { OrderController } from '@/controllers/order.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class OrderRoute implements Routes {
  public router = Router();
  public order = new OrderController();
  public path = '/v1/orders';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, ClerkExpressRequireAuth(), this.order.getOrder);
    this.router.get(`${this.path}/allow-review/:productId`, ClerkExpressRequireAuth(), this.order.getAllowOrders);
    this.router.get(`${this.path}`, ClerkExpressRequireAuth(), this.order.getOrders);
    this.router.patch(`${this.path}/admin-accept/:orderId`, ClerkExpressRequireAuth(), this.order.adminAcceptOrder);
    this.router.patch(`${this.path}/admin-reject/:orderId`, ClerkExpressRequireAuth(), this.order.adminRejectOrder);
    this.router.patch(`${this.path}/admin-send/:orderId`, ClerkExpressRequireAuth(), this.order.adminSendOrder);
    this.router.patch(`${this.path}/admin-cancel/:orderId`, ClerkExpressRequireAuth(), this.order.adminCancelOrder);
    this.router.get(`${this.path}/user/current-user`, ClerkExpressRequireAuth(), this.order.getCurrentUserOrders);
    this.router.post(`${this.path}/cancel/:orderId`, ClerkExpressRequireAuth(), this.order.cancelOrder);
    this.router.post(`${this.path}/confirm/:orderId`, ClerkExpressRequireAuth(), this.order.confirmOrder);
  }
}
