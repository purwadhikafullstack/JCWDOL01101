import { MutationController } from '@/controllers/mutation.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class MutationRoute implements Routes {
  public router = Router();
  public mutation = new MutationController();
  auth = new AuthMiddleware();
  public path = '/v1/mutations';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.auth.ClerkAuth, this.mutation.getMutations);
    this.router.post(`${this.path}`, this.mutation.createMutation);
    this.router.patch(`${this.path}/cancel/:mutationId`, this.mutation.cancelMutation);
    this.router.patch(`${this.path}/accept/:mutationId`, this.mutation.acceptMutation);
    this.router.patch(`${this.path}/reject/:mutationId`, this.mutation.rejectMutation);
  }
}
