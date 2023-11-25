import { City } from '@/interfaces/city.interface';
import { CityService } from '@/services/city.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class CityController {
  public city = Container.get(CityService);

  public getCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCityData: City[] = await this.city.findAllCity();

      res.status(200).json({ data: findAllCityData, message: 'find all City' });
    } catch (error) {
      next(error);
    }
  };

  public getCityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cityId = req.params.id;
      const findOneCityData: City = await this.city.findCityById(cityId);

      res.status(200).json({ data: findOneCityData, message: 'find City By Id' });
    } catch (error) {
      next(error);
    }
  };

  public getCityByProvinceId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provinceId = req.params.id;
      const findAllCityData: City[] = await this.city.findAllCityByProvince(provinceId);

      res.status(200).json({ data: findAllCityData, message: 'find all City' });
    } catch (error) {
      next(error);
    }
  };
}
