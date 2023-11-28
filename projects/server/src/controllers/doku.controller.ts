import { DokuService } from '@/services/doku.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class DokuController {
  doku = Container.get(DokuService);

  public createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentIntent = await this.doku.createPaymentIntent();

      res.status(200).json({
        message: 'create.paymentIntent',
        data: paymentIntent,
      });
    } catch (err) {
      next(err);
    }
  };
}
