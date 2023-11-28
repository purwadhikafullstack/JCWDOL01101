import { UserController } from '@/controllers/user.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import bodyParser from 'body-parser';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public router = Router();
  public user = new UserController();
  public admin = new AuthMiddleware();
  public path = '/v1/users';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/v1/webhook', bodyParser.raw({ type: 'application/json' }), this.user.webhook);
    this.router.get(`${this.path}/:externalId`, this.user.getUserByExternalId);
    this.router.get('/v1/dashboard/user/:userId', this.user.getUser);
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.post('/v1/admin', this.user.createAdmin);
    this.router.put('/v1/manage-admin/:userId', this.user.manageAdmin);
    this.router.delete('/v1/manage-admin/:userId', this.user.deleteAdmin);
  }
}
