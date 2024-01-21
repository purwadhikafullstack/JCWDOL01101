import { Province } from '@/interfaces/province.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProvinceModel extends Model<Province> implements Province {
  declare provinceId: string;
  declare province: string;
}

export default function (sequelize: Sequelize): typeof ProvinceModel {
  ProvinceModel.init(
    {
      provinceId: {
        primaryKey: true,
        type: DataTypes.STRING(256),
      },
      province: DataTypes.STRING(256),
    },
    { sequelize, tableName: 'province', timestamps: false },
  );

  return ProvinceModel;
}
