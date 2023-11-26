import { City } from '@/interfaces/city.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class CityModel extends Model<City> implements City {
  public cityId: string;
  public provinceId: string;
  public province: string;
  public cityName: string;
  public postalCode: string;
  public type: string;
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
