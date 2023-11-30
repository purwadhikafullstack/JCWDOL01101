import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Service } from 'typedi';
import { City } from '@/interfaces/city.interface';

@Service()
export class CityService {
  public async findAllCity(): Promise<City[]> {
    const allCity: City[] = await DB.City.findAll();
    return allCity;
  }

  public async findCityById(cityId: number): Promise<City> {
    const findCity: City = await DB.City.findByPk(cityId);
    if (!findCity) throw new HttpException(409, "City doesn't exist");

    return findCity;
  }
}
