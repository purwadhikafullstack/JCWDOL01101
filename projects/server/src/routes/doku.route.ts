import { DokuController } from '@/controllers/doku.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class DokuRoute implements Routes {
  public router = Router();
  public doku = new DokuController();
  public path = '/api/doku';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/payment-url`, this.doku.createPaymentIntent);
  }
}
