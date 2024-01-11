import { LastSeenProductService } from '@/services/lastSeenProduct.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class LastSeenProductController {
  lastSeen = Container.get(LastSeenProductService);

  public getLastSeenProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const lastSeenProducts = await this.lastSeen.findAllLastSeenProducts(userId);

      return res.status(200).json({
        data: lastSeenProducts,
        message: 'last seen products',
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  public postLastSeenProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.body.userId);
      const productId = Number(req.body.productId);
      const lastSeenProducts = await this.lastSeen.createLastSeenProduct({ userId, productId });

      res.status(201).json({
        data: lastSeenProducts,
        message: 'last seen product created',
      });
    } catch (error) {
      next(error);
    }
  };
}
