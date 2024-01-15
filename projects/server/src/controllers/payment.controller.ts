import { Payment } from '@/interfaces/payment.interface';
import { PaymentDetailService } from '@/services/payment.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class paymentController {
  payment = Container.get(PaymentDetailService);

  public async postPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentData = req.body;
      const payment: Payment = await this.payment.createPaymentDetail(paymentData);

      res.status(200).json({
        data: payment,
        message: 'post payment',
      });
    } catch (err) {
      next(err);
    }
  }
}
