import { Sequelize, DataTypes, Model } from 'sequelize';
import { City } from '@/interfaces/city.interface';
import { ProvinceModel } from './province.model';

export class CityModel extends Model<City> implements City {
  public id?: number;
  public provinceId?: number;
  public city: string;
  public postalCode: number;
}

export default function (sequelize: Sequelize): typeof CityModel {
  CityModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      provinceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      postalCode: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'cities',
      sequelize,
      timestamps: false,
    },
  );

  ProvinceModel.hasMany(CityModel, {
    foreignKey: 'provinceId',
  });

  CityModel.belongsTo(ProvinceModel, {
    foreignKey: 'provinceId',
  });

  return CityModel;
}
