import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Service } from 'typedi';
import { Province } from '@/interfaces/province.interface';

@Service()
export class ProvinceService {
  public async findAllProvince(): Promise<Province[]> {
    const allProvince: Province[] = await DB.Province.findAll();
    return allProvince;
  }

  public async findProvinceById(provinceId: number): Promise<Province> {
    const findProvince: Province = await DB.Province.findByPk(provinceId);
    if (!findProvince) throw new HttpException(409, "Province doesn't exist");
    return findProvince;
  }
}
