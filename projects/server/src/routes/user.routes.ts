import { UserController } from '@/controllers/user.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class UserRoute implements Routes {
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/api/webhook', this.user.webhook);
  }
}
