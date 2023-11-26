import { Province } from '@/interfaces/province.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProvinceModel extends Model<Province> implements Province {
  public provinceId: string;
  public province: string;
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
    { sequelize, tableName: 'provinces', timestamps: false },
  );

  return ProvinceModel;
}
