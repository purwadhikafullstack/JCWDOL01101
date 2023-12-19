import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { JurnalController } from '@/controllers/jurnal.controller';

export class JurnalRoute implements Routes {
  public path = '/v1/jurnals';
  public router = Router();
  public jurnal = new JurnalController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.jurnal.getJurnal);
    this.router.get(`${this.path}/:id`, this.jurnal.getJurnalById);
    this.router.post(`${this.path}`, this.jurnal.createJurnal);
    this.router.put(`${this.path}/:id`, this.jurnal.updateJurnal);
    this.router.delete(`${this.path}/:id`, this.jurnal.deleteJurnal);
  }
}
