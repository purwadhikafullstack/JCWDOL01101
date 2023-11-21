import { Warehouse } from "@/interfaces/warehouse.interface";
import { WarehouseService } from "@/services/warehouse.service";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";

export class WarehouseController {
  // public getWarehouseAddress = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const warehouseId = Number(req.params.id);
  //     const findOneWarehouseData: Warehouse = await this.warehouse.findWarehouseById(warehouseId);
  //     const warehouseAddress = findOneWarehouseData.addressId;

  //     res.status(200).json({ data: warehouseAddress, message: 'find Warehouse Address' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public warehouse = Container.get(WarehouseService);

  public getWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllWarehouseData: Warehouse[] = await this.warehouse.findAllWarehouse();

      res.status(200).json({ data: findAllWarehouseData, message: 'find all Warehouse' });
    } catch (error) {
      next(error);
    }
  };

  public getWarehouseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouseId = Number(req.params.id);
      const findOneWarehouseData: Warehouse = await this.warehouse.findWarehouseById(warehouseId);

      res.status(200).json({ data: findOneWarehouseData, message: 'find Warehouse By Id' });
    } catch (error) {
      next(error);
    }
  };

  public createWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouseData: Warehouse = req.body;
      const createWarehouseData: Warehouse = await this.warehouse.createWarehouse(warehouseData);

      res.status(201).json({ data: createWarehouseData, message: 'Warehouse created' });
    } catch (error) {
      next(error);
    }
  };

  public updateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouseId = Number(req.params.id);
      const warehouseData: Warehouse = req.body;
      const updateWarehouseData: Warehouse = await this.warehouse.updateWarehouse(warehouseId, warehouseData);

      res.status(200).json({ data: updateWarehouseData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const warehouseId = Number(req.params.id);
      const deleteWarehouseData: Warehouse = await this.warehouse.deleteWarehouse(warehouseId);

      res.status(200).json({ data: deleteWarehouseData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };



}