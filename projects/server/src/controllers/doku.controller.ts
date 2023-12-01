import { DokuService } from '@/services/doku.service';
import { OrderService } from '@/services/order.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class DokuController {
  doku = Container.get(DokuService);
  order = Container.get(OrderService);

  public createPaymentIntent = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const totalPrice = Number(req.body.totalPrice);
      const paymentMethod = String(req.body.payment);
      const paymentIntent = await this.doku.createPaymentIntent({
        externalId,
        totalPrice,
        paymentMethod,
      });

      res.status(200).json({
        message: 'create.paymentIntent',
        data: paymentIntent,
      });
    } catch (err) {
      next(err);
    }
  };

  public postNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.doku.verifyNotification(req.headers, req.body);
      console.log(payment);

      res.status(200).json({
        message: 'payment success',
        // data: payment,
      });
    } catch (err) {
      next(err);
    }
  };
}
