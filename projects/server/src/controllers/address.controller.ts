// import { Warehouse } from "@/interfaces/warehouse.interface";
// import { WarehouseService } from "@/services/warehouse.service";
import { Address } from "@/interfaces/address.interface";
import { AddressService } from "@/services/address.service";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";

export class AddressController{
    public address = Container.get(AddressService);

    public getAddress = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const findAllAddressData:Address[]=await this.address.findAllAddress();

            res.status(200).json({data:findAllAddressData,message:'find all Address'});
        }catch(error){
            next(error);
        }
    };

    public getAddressById =async (req:Request,res:Response,next:NextFunction) => {
        try{
            const addressId=Number(req.params.id);
            const findOneAddressData:Address=await this.address.findAddressById(addressId);

            res.status(200).json({data:findOneAddressData,message:'find Address By Id'});
        }catch(error){
            next(error);
        }
    };

    public createAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const addressData: Address = req.body;
          const createAddressData: Address = await this.address.createAddress(addressData);
    
          res.status(201).json({ data: createAddressData, message: 'Address created' });
        } catch (error) {
          next(error);
        }
      };

      public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const addressId = Number(req.params.id);
          const addressData: Address = req.body;
          const updateAddressData: Address = await this.address.updateAddress(addressId, addressData);
    
          res.status(200).json({ data: updateAddressData, message: 'updated' });
        } catch (error) {
          next(error);
        }
      };
    
      public deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const addressId = Number(req.params.id);
          const deleteAddressData: Address = await this.address.deleteAddress(addressId);
    
          res.status(200).json({ data: deleteAddressData, message: 'deleted' });
        } catch (error) {
          next(error);
        }
      };
}