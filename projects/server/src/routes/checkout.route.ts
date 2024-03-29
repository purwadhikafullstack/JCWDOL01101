import { CheckoutController } from '@/controllers/checkout.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class CheckoutRoute implements Routes {
  public router = Router();
  public checkout = new CheckoutController();
  public path = '/v1/checkout';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/courier`, this.checkout.getCourierService);
    this.router.get(`${this.path}/cart/:cartId/products`, this.checkout.getAllSelectedCartProduct);
    this.router.post(`${this.path}/find-closest-warehouse`, ClerkExpressRequireAuth(), this.checkout.getClosestWarehouseWithStock);
  }
}
