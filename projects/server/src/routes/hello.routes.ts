import { HelloController } from '@/controllers/hello.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class HelloRoute implements Routes {
  public router = Router();
  public hello = new HelloController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/api/greetings', this.hello.greeting);
  }
}
