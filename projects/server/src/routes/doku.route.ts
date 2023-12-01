import { DokuController } from '@/controllers/doku.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class DokuRoute implements Routes {
  public router = Router();
  public doku = new DokuController();
  public path = '/v1/doku';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/payment-url`, ClerkExpressRequireAuth(), this.doku.createPaymentIntent);
    this.router.post(`${this.path}/payment/notify`, this.doku.postNotify);
  }
}
