import { MutationController } from '@/controllers/mutation.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class MutationRoute implements Routes {
  public router = Router();
  public mutation = new MutationController();
  public path = '/v1/mutations';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, ClerkExpressRequireAuth(), this.mutation.getMutations);
    this.router.post(`${this.path}`, this.mutation.createMutation);
    this.router.patch(`${this.path}/cancel/:mutationId`, this.mutation.cancelMutation);
    this.router.patch(`${this.path}/accept/:mutationId`, this.mutation.acceptMutation);
    this.router.patch(`${this.path}/reject/:mutationId`, this.mutation.rejectMutation);
  }
}
