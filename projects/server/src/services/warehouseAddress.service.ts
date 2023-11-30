import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { WarehouseAddress } from '@/interfaces/warehouseAddress.interface';
import { Service } from 'typedi';
const opencage = require('opencage-api-client');

@Service()
export class WarehouseAddressService {
    public async findAllWarehouseAddress():Promise<WarehouseAddress[]> {
        const allAddress: WarehouseAddress[] = await DB.WarehouseAddresses.findAll();
        return allAddress;
    }

    public async findWarehouseAddressById(warehouseAddressId: number): Promise<WarehouseAddress> {
        const findAddress: WarehouseAddress = await DB.WarehouseAddresses.findByPk(warehouseAddressId);
        if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    
        return findAddress;
    }

    public async createWarehouseAddress(addressData:WarehouseAddress):Promise<WarehouseAddress>{
        // const city = await DB.City.findOne({where:{cityId:addressData.cityId}})
        // const data = await opencage.geocode({q:city.cityName, language:'id'})
        // const place: OpenCageResults = data.results[0];
        // const {lat,lng} = place.geometry

        const createAddressData:WarehouseAddress= await DB.WarehouseAddresses.create({...addressData});
        return createAddressData;
    }

    public async updateWarehouseAddress(warehouseAddressId: number, addressData: WarehouseAddress): Promise<WarehouseAddress> {
        const findAddress: WarehouseAddress = await DB.WarehouseAddresses.findByPk(warehouseAddressId);
        if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    

        await DB.WarehouseAddresses.update({ ...addressData}, { where: { id: warehouseAddressId } });
        const updateAddress: WarehouseAddress = await DB.WarehouseAddresses.findByPk(warehouseAddressId);
        return updateAddress;
    }
    
    public async deleteWarehouseAddress(warehouseAddressId: number): Promise<WarehouseAddress> {
      const findAddress: WarehouseAddress = await DB.WarehouseAddresses.findByPk(warehouseAddressId);
      if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    
      await DB.WarehouseAddresses.destroy({ where: { id: warehouseAddressId } });
    
      return findAddress;
    }

}
