import { CheckoutController } from '@/controllers/checkout.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class CheckoutRoute implements Routes {
  public router = Router();
  public checkout = new CheckoutController();
  public path = '/api/checkout';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/courier`, this.checkout.getCourierService);
  }
}
