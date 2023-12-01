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
      const cartId = Number(req.body.cartId);
      const totalPrice = Number(req.body.totalPrice);
      const externalId = req.auth.userId;
      const warehouseId = Number(req.body.warehouseId);
      const paymentMethod = String(req.body.payment);
      const paymentIntent = await this.doku.createPaymentIntent({
        cartId,
        externalId,
        totalPrice,
        warehouseId,
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
      const invoice = String(req.body.order.invoice_number);
      const transactionStatus = String(req.body.transaction.status);
      await this.doku.verifyNotification(invoice, transactionStatus);

      res.status(200).json({
        message: 'payment success',
      });
    } catch (err) {
      next(err);
    }
  };
}
