import { Jurnal } from '@/interfaces/jurnal.interface';
import { JurnalService } from '@/services/jurnal.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
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

  public getJurnaltes = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter, limit, warehouse, to, from } = req.query;
      const jurnals = await this.jurnal.findAllJurnaltes({
        s: String(s),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
        to: new Date(String(to)),
        from: new Date(String(from)),
      });

      // const stockSummary = await this.jurnal.getStockSummary({
      //   from: new Date(String(from)),
      //   to: new Date(String(to)),
      //   s: String(s),
      // });
      
      console.log("controller====================================")
      console.log(jurnals);
      res.status(200).json({
        data: jurnals,
        // stockSummary,
        message: 'get.jurnals',
      });
    } catch (err) {
      next(err);
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
