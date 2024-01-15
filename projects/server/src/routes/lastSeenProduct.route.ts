import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { LastSeenProductController } from '@/controllers/lastSeenProduct.controller';

export class LastSeenProductRoute implements Routes {
  public path = '/v1/last-seen-product';
  public router = Router();
  public lastSeenProduct = new LastSeenProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, this.lastSeenProduct.getLastSeenProducts);
    this.router.post(`${this.path}`, this.lastSeenProduct.postLastSeenProduct);
  }
}
