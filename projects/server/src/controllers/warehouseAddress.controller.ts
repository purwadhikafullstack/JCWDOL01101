import { WarehouseAddress } from '@/interfaces/warehouseAddress.interface';
import { WarehouseAddressService } from '@/services/warehouseAddress.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class WarehouseAddressController {
  public address = Container.get(WarehouseAddressService);

  public getWarehouseAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllAddressData: WarehouseAddress[] = await this.address.findAllWarehouseAddress();

      res.status(200).json({ data: findAllAddressData, message: 'find all Address' });
    } catch (error) {
      next(error);
    }
  };

  public getWarehouseAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.id);
      const findOneAddressData: WarehouseAddress = await this.address.findWarehouseAddressById(addressId);

      res.status(200).json({ data: findOneAddressData, message: 'find Address By Id' });
    } catch (error) {
      next(error);
    }
  };

  public createWarehouseAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressData: WarehouseAddress = req.body;
      const createAddressData: WarehouseAddress = await this.address.createWarehouseAddress(addressData);

      res.status(201).json({ data: createAddressData, message: 'Address created' });
    } catch (error) {
      next(error);
    }
  };

  public updateWarehouseAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.id);
      const addressData: WarehouseAddress = req.body;
      const updateAddressData: WarehouseAddress = await this.address.updateWarehouseAddress(addressId, addressData);

      res.status(200).json({ data: updateAddressData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWarehouseAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = Number(req.params.id);
      const deleteAddressData: WarehouseAddress = await this.address.deleteWarehouseAddress(addressId);

      res.status(200).json({ data: deleteAddressData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
