import { UserController } from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

export class UserRoute implements Routes {
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/api/user', this.user.getUsers);
    this.router.get('/api/user/:id', this.user.getUserbyId);
    this.router.post('/api/user', this.user.createUser);
    this.router.put('/api/manage-user/:id', this.user.updateUser);
  }
}
