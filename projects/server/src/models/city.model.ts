import { City } from '@/interfaces/city.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class CityModel extends Model<City> implements City {
  declare cityId: string;
  declare provinceId: string;
  declare province: string;
  declare cityName: string;
  declare postalCode: string;
  declare type: string;
}

export default function (sequelize: Sequelize): typeof CityModel {
  CityModel.init(
    {
      cityId: {
        primaryKey: true,
        type: DataTypes.STRING(256),
      },
      provinceId: DataTypes.STRING(256),
      province: DataTypes.STRING(256),
      cityName: DataTypes.STRING(256),
      postalCode: DataTypes.STRING(256),
      type: DataTypes.STRING(256),
    },
    { sequelize, tableName: 'cities', timestamps: false },
  );

  return CityModel;
}
