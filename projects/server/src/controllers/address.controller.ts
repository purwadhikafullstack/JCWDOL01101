import { AddressDto } from '@/dtos/address.dto';
import { Address } from '@/interfaces/address.interface';
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

  public getAllAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = String(req.query.search);
      const findAllAddress = await this.address.getAllAddress(search);

      res.status(200).json({
        message: 'get.address',
        data: findAllAddress,
      });
    } catch (err) {
      next(err);
    }
  };
  public checkActiveParam = async (req: Request, res: Response, next: NextFunction) => {
    const addressId = req.params.addressId;
    if (addressId === 'active') {
      next('route');
    } else {
      next();
    }
  };

  public getAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.addressId);
      const findAddress: Address = await this.address.getAddressbyId(addressId);

      res.status(200).json({
        message: 'get.getAddress',
        data: findAddress,
      });
    } catch (err) {
      next(err);
    }
  };

  public getActiveAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAddress: Address = await this.address.getActiveAddress();

      res.status(200).json({
        message: 'get.activeAddress',
        data: findAddress,
      });
    } catch (err) {
      next(err);
    }
  };

  public createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressData: AddressDto = req.body;
      const createdAddress: Address = await this.address.createAddress({ ...addressData });

      res.status(200).json({
        message: 'post.address',
        data: createdAddress,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.addressId);
      const addressData: AddressDto = req.body;
      const updatedAddress: Address = await this.address.updateAddress(addressId, { ...addressData });

      res.status(200).json({
        message: 'put.address',
        data: updatedAddress,
      });
    } catch (err) {
      next(err);
    }
  };

  public toggleAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.addressId);
      const field = String(req.params.field);
      const updatedAddress: Address = await this.address.toggleAddress(addressId, field);

      res.status(200).json({
        message: 'patch.address',
        data: updatedAddress,
      });
    } catch (err) {
      next(err);
    }
  };
}
