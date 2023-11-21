import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
// import { Warehouse } from '@/interfaces/warehouse.interface';
import { Address } from '@/interfaces/address.interface';
import { Service } from 'typedi';

@Service()
export class AddressService {
    public async findAllAddress():Promise<Address[]> {
        const allAddress: Address[] = await DB.Addresses.findAll();
        return allAddress;
    }

    public async findAddressById(addressId: number): Promise<Address> {
        const findAddress: Address = await DB.Addresses.findByPk(addressId);
        if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    
        return findAddress;
      }

    public async createAddress(addressData:Address):Promise<Address>{
        const findAddress: Address=await DB.Addresses.findOne({where:{addressDetail:addressData.addressDetail}})
        if (findAddress) throw new HttpException(409, 'Address already exist');

        const createAddressData:Address= await DB.Addresses.create({...addressData});
        return createAddressData;
    }

    public async updateAddress(addressId: number, addressData: Address): Promise<Address> {
        const findAddress: Address = await DB.Addresses.findByPk(addressId);
        if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    

        await DB.Addresses.update({ ...addressData}, { where: { id: addressId } });
        const updateAddress: Address = await DB.Addresses.findByPk(addressId);
        return updateAddress;
      }
    
      public async deleteAddress(addressId: number): Promise<Address> {
        const findAddress: Address = await DB.Addresses.findByPk(addressId);
        if (!findAddress) throw new HttpException(409, "Address doesn't exist");
    
        await DB.Addresses.destroy({ where: { id: addressId } });
    
        return findAddress;
      }

}
