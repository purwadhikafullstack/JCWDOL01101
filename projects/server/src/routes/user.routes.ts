import { UserController } from '@/controllers/user.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import bodyParser from 'body-parser';

export class UserRoute implements Routes {
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), this.user.webhook);
    this.router.get('/api/user', this.user.getUsers);
    this.router.get('/api/user/:id', this.user.getUserbyId);
    this.router.put('/api/manage-user/:id', this.user.manageUser);
  }
}
