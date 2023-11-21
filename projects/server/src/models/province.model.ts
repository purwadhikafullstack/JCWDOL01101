import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Province } from '@/interfaces/province.interface';
import { CityModel } from './city.model';
import { AddressModel } from './address.model';

export class ProvinceModel extends Model<Province> implements Province {
  public id: number;
  public province: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ProvinceModel {
    ProvinceModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      province: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
    },
    {
      tableName: 'provinces',
      sequelize,
    },
  );

  // ProvinceModel.hasOne(AddressModel, {
  //   foreignKey: "provinceId",
  // });
  
  // AddressModel.belongsTo(ProvinceModel, {
  //   foreignKey: "provinceId",
  // });

  return ProvinceModel;
}