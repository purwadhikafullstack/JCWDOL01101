import { DB } from '@/database';
import { AddressDto } from '@/dtos/address.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Address } from '@/interfaces/address.interface';
import { City } from '@/interfaces/city.interface';
import { CityModel } from '@/models/city.model';
import opencage from 'opencage-api-client';
import { FindOptions, Op } from 'sequelize';
import { Service } from 'typedi';

type OpenCageResults = {
  formatted: string;
  components: {
    road: string;
    city: string;
    city_code: string;
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

    const findCity: City = await DB.City.findOne({ where: { cityName: { [Op.like]: `%${place.components.city}%` } } });
    if (!findCity) throw new HttpException(409, "City doesn't exist");
    place.components.city_code = findCity.cityId;

    return place;
  }

  public async getAllAddress(search: string): Promise<Address[]> {
    const options: FindOptions<Address> = {
      paranoid: true,
      include: [
        {
          model: CityModel,
          as: 'city',
          attributes: ['cityName', 'province'],
        },
      ],
      attributes: ['id', 'recepient', 'phone', 'label', 'address', 'notes', 'isMain', 'isActive'],
      order: [['isActive', 'DESC']],
      where: search
        ? {
          [Op.or]: [
            { recepient: { [Op.like]: `%${search}%` } },
            { '$city.city_name$': { [Op.like]: `%${search}%` } },
            { label: { [Op.like]: `%${search}%` } },
          ],
        }
        : {},
      raw: true,
    };
    const findAddress: Address[] = await DB.Address.findAll(options);

    return findAddress;
  }

  public async getAllAddressByUserId(userId: number): Promise<Address[]> {
    const findAddress = await DB.Address.findAll({ where: { deletedAt: null, userId }, order: [['isMain', 'DESC']] });

    return findAddress;
  }

  public async getAddressbyId(addressId: number): Promise<Address> {
    const findAddress = await DB.Address.findOne({ where: { deletedAt: null, id: addressId } });
    return findAddress;
  }

  public async getActiveAddress(): Promise<Address> {
    const findAddress = await DB.Address.findOne({
      where: { deletedAt: null, isActive: true },
      include: [
        {
          model: CityModel,
          as: 'city',
        },
      ],
    });

    return findAddress;
  }

  public async createAddress(addressData: AddressDto): Promise<Address> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findCity: City = await DB.City.findOne({ where: { cityName: { [Op.like]: `%${addressData.cityId}%` } } });
      if (!findCity) throw new HttpException(409, "City doesn't exist");
      const address = await DB.Address.create({ ...addressData, cityId: findCity.cityId || addressData.cityId });

      await transaction.commit();
      return address;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async updateAddress(addressId: number, addressData: AddressDto): Promise<Address> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findAddress = await DB.Address.findByPk(addressId, { paranoid: true });
      if (!findAddress) throw new HttpException(409, "Address doesn't exist");
      await DB.Address.update({ ...addressData }, { where: { id: addressId }, transaction });

      await transaction.commit();
      const updatedAddress = await DB.Address.findByPk(addressId);
      return updatedAddress;
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
}
