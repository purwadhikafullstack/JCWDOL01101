import { Jurnal } from '@/interfaces/jurnal.interface';
import { JurnalService } from '@/services/jurnal.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class JurnalController {
  public jurnal = Container.get(JurnalService);

  public getJurnal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllJurnalData: Jurnal[] = await this.jurnal.findAllJurnal();

      res.status(200).json({ data: findAllJurnalData, message: 'find all Jurnal' });
    } catch (error) {
      next(error);
    }
  };

  public getJurnalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jurnalId = Number(req.params.id);
      const findOneJurnalData: Jurnal = await this.jurnal.findJurnalById(jurnalId);

      res.status(200).json({ data: findOneJurnalData, message: 'find Jurnal By Id' });
    } catch (error) {
      next(error);
    }
  };

  public createJurnal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jurnalData: Jurnal = req.body;
      const createJurnalData: Jurnal = await this.jurnal.createJurnal(jurnalData);

      res.status(201).json({ data: createJurnalData, message: 'Jurnal created' });
    } catch (error) {
      next(error);
    }
  };

  public updateJurnal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jurnalId = Number(req.params.id);
      const jurnalData: Jurnal = req.body;
      const updateJurnalData: Jurnal = await this.jurnal.updateJurnal(jurnalId, jurnalData);

      res.status(200).json({ data: updateJurnalData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteJurnal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jurnalId = Number(req.params.id);
      const deleteJurnalData: Jurnal = await this.jurnal.deleteJurnal(jurnalId);

      res.status(200).json({ data: deleteJurnalData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
