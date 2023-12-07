import { DB } from '@/database';
import { AddressDto } from '@/dtos/address.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Address } from '@/interfaces/address.interface';
import { City } from '@/interfaces/city.interface';
import { User } from '@/interfaces/user.interface';
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

  public async getCityByName(search: string): Promise<City[]> {
    const options: FindOptions<City> = {
      where: search
        ? {
            [Op.or]: [{ cityName: { [Op.like]: `%${search}%` } }],
          }
        : {},
    };
    const findCity: City[] = await DB.City.findAll(options);

    return findCity;
  }

  public async getAllAddress(externalId: string, search: string): Promise<Address[]> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
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
        : { userId: findUser.id },
      raw: true,
    };
    const findAddress: Address[] = await DB.Address.findAll(options);

    return findAddress;
  }

  public async getAllAddressByUserId(userId: number): Promise<Address[]> {
    const findAddress = await DB.Address.findAll({
      where: { deletedAt: null, userId },
      include: [
        {
          model: CityModel,
          as: 'city',
        },
      ],
      order: [['isMain', 'DESC']],
    });

    return findAddress;
  }

  public async getAddressbyId(addressId: number): Promise<Address> {
    const findAddress = await DB.Address.findOne({
      where: { deletedAt: null, id: addressId },
      include: [
        {
          model: CityModel,
          as: 'city',
        },
      ],
    });
    return findAddress;
  }

  public async getActiveAddress(externalId: string): Promise<Address> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const findAddress = await DB.Address.findOne({
      where: { deletedAt: null, isActive: true, userId: findUser.id },
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
      const city = await DB.City.findOne({ where: { cityId: addressData.cityId } });
      if (!city) throw new HttpException(409, "City doens't exist");
      const data = await opencage.geocode({ q: city.cityName, language: 'id' });
      const place = data.results[0];
      const { lat, lng } = place.geometry;
      const address = await DB.Address.create({ ...addressData, lat, lng });
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
      if (addressData.isMain) {
        await DB.Address.update({ isMain: false }, { where: { isMain: true }, transaction });
      }
      await DB.Address.update({ ...addressData }, { where: { id: addressId }, transaction });

      await transaction.commit();
      const updatedAddress = await DB.Address.findByPk(addressId);
      return updatedAddress;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async deleteAddress(addressId: number): Promise<Address> {
    const findAddress: Address = await DB.Address.findOne({ where: { id: addressId } });
    if (!findAddress) throw new HttpException(409, "Address doesn't exists");

    const date = new Date();
    await DB.Address.update({ deletedAt: date }, { where: { id: addressId } });
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

  public async setMainAddress(addressId: number): Promise<Address> {
    await DB.Address.update({ isMain: false }, { where: { isMain: true } });
    await DB.Address.update({ isMain: true }, { where: { id: addressId } });
    const updatedAddress = await DB.Address.findByPk(addressId);
    return updatedAddress;
  }
}
