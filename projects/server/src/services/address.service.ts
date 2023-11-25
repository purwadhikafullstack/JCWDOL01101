import { DB } from '@/database';
import { AddressDto } from '@/dtos/address.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Address } from '@/interfaces/address.interface';
import opencage from 'opencage-api-client';
import { Service } from 'typedi';

type OpenCageResults = {
  formatted: string;
  components: {
    road: string;
    city: string;
    city_district: string;
    country: string;
    county: string;
    postcode: string;
    state: string;
  };
};

@Service()
export class AddressService {
  public async getCurrentLocation(latitude: number, langitude: number): Promise<OpenCageResults> {
    const data = await opencage.geocode({ q: `${latitude}, ${langitude}`, language: 'id' });
    const place: OpenCageResults = data.results[0];

    return place;
  }

  public async getAllAddress(): Promise<Address[]> {
    const findAddress = await DB.Address.findAll({ where: { deletedAt: null }, order: [['isActive', 'DESC']] });

    return findAddress;
  }

  public async getAllAddressByUserId(userId: number): Promise<Address[]> {
    const findAddress = await DB.Address.findAll({ where: { deletedAt: null, userId }, order: [['isPrimary', 'DESC']] });

    return findAddress;
  }

  public async getActiveAddress(): Promise<Address> {
    const findAddress = await DB.Address.findOne({ where: { deletedAt: null, isActive: true } });

    return findAddress;
  }

  public async createAddress(addressData: AddressDto): Promise<Address> {
    const newAddress: Address = await DB.Address.create({ ...addressData });
    if (addressData.isPrimary) {
      await DB.Address.update(
        {
          isPrimary: false,
        },
        { where: {} },
      );

      await DB.Address.update(
        {
          isPrimary: true,
        },
        { where: { id: newAddress.id } },
      );
    }
    return newAddress;
  }

  public async updateAddress(addressId: number, addressData: AddressDto): Promise<Address> {
    const findAddress: Address = await DB.Address.findOne({ where: { id: addressId } });
    if (!findAddress) throw new HttpException(409, "Address doesn't exists");

    if (addressData.isPrimary) {
      await DB.Address.update(
        {
          isPrimary: false,
        },
        { where: {} },
      );
    }
    await DB.Address.update({ ...addressData }, { where: { id: addressId } });
    const updatedAddress = await DB.Address.findOne({ where: { id: addressId } });
    return updatedAddress;
  }

  public async toggleAddress(addressId: number, field: string): Promise<Address> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findAddress: Address = await DB.Address.findByPk(addressId);
      if (!findAddress) throw new HttpException(409, "Address doesn't exists");

      await DB.Address.update(
        {
          [field]: false,
        },
        { where: {}, transaction },
      );

      await DB.Address.update(
        {
          [field]: true,
        },
        { where: { id: addressId }, transaction },
      );

      await transaction.commit();
      const findUpdatedAddress: Address = await DB.Address.findByPk(addressId);
      return findUpdatedAddress;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async deleteAddress(addressId: number) {
    const findAddress: Address = await DB.Address.findOne({ where: { id: addressId } });
    if (!findAddress) throw new HttpException(409, "Address doesn't exists");

    const date = new Date();
    await DB.Address.update({ deletedAt: date }, { where: { id: addressId } });
    const updatedAddress = await DB.Address.findOne({ where: { id: addressId } });
    return updatedAddress.deletedAt;
  }
}
