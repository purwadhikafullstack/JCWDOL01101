import { Province } from '@/interfaces/province.interface';
import { ProvinceService } from '@/services/province.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ProvinceController {
  public province = Container.get(ProvinceService);

  public getProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProvinceData: Province[] = await this.province.findAllProvince();

      res.status(200).json({ data: findAllProvinceData, message: 'find all Province' });
    } catch (error) {
      next(error);
    }
  };

  public getProvinceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provinceId = Number(req.params.id);
      const findOneProvinceData: Province = await this.province.findProvinceById(provinceId);

      res.status(200).json({ data: findOneProvinceData, message: 'find Province By Id' });
    } catch (error) {
      next(error);
    }
  };
}
