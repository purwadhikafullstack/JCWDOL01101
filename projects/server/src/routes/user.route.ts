import { UserController } from '@/controllers/user.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import bodyParser from 'body-parser';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public router = Router();
  public user = new UserController();
  public admin = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), this.user.webhook);
    this.router.get('/api/users', this.user.getUsers);
    this.router.post('/api/admin', this.user.createAdmin);
  }
}
