import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { WarehouseAddress } from '@/interfaces/warehouseAddress.interface';
import { WarehouseModel } from './warehouse.model';
import { ProvinceModel } from './province.model';

export class WarehouseAddressModel extends Model<WarehouseAddress> implements WarehouseAddress {
  public id: number;
  public addressDetail: string;
  public cityId: number;
  public provinceId: number;
  public longitude: number;
  public latitude: number;
  public isActive:boolean;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WarehouseAddressModel {
  WarehouseAddressModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      addressDetail: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      provinceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      cityId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      longitude: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      latitude: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      isActive: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      },
    },
    {
      tableName: 'warehouseAddresses',
      sequelize,
    },
  );


  return WarehouseAddressModel;
}