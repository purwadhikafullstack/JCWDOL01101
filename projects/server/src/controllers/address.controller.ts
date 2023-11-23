import { AddressService } from '@/services/address.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class AdressController {
  address = Container.get(AddressService);

  public getCurrentLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lat = Number(req.params.lat);
      const lng = Number(req.params.lng);
      const result = await this.address.getCurrentLocation(lat, lng);

      res.status(200).json({
        message: 'get.currentLocation',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
