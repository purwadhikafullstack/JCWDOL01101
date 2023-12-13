import { CheckoutService } from '@/services/checkout.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class CheckoutController {
  checkout = Container.get(CheckoutService);

  public getCourierService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const origin = String(req.query.origin);
      const destination = String(req.query.destination);
      const weight = Number(req.query.weight);
      const courier = String(req.query.courier);
      const findCourier = await this.checkout.getCourierService(origin, destination, weight, courier);

      res.status(200).json({
        data: findCourier,
        message: 'get.courier',
      });
    } catch (err) {
      next(err);
    }
  };

  public getAllSelectedCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartId = Number(req.params.cartId);
      const findAllCartProduct = await this.checkout.getSelectedCartProduct(cartId);

      res.status(200).json({
        data: findAllCartProduct,
        message: 'get.cartproducts',
      });
    } catch (err) {
      next(err);
    }
  };
}
