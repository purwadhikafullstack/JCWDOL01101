import { MutationController } from '@/controllers/mutation.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class MutationRoute implements Routes {
  public router = Router();
  public mutation = new MutationController();
  public path = '/v1/mutation';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.mutation.createMutation);
    this.router.get(`${this.path}/product`, this.mutation.getProductsByName);
  }
}
