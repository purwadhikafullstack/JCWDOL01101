import { Sequelize, DataTypes, Model } from 'sequelize';
import { WarehouseAddress } from '@/interfaces/warehouseAddress.interface';

export class WarehouseAddressModel extends Model<WarehouseAddress> implements WarehouseAddress {
  declare id: number;
  declare addressDetail: string;
  declare cityId: string;
  declare provinceId: string;
  declare longitude: number;
  declare latitude: number;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
        type: DataTypes.STRING(256),
      },
      cityId: {
        allowNull: true,
        type: DataTypes.STRING(256),
      },
      longitude: {
        allowNull: true,
        type: DataTypes.FLOAT(10, 6),
      },
      latitude: {
        allowNull: true,
        type: DataTypes.FLOAT(10, 6),
      },
      isActive: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'warehouseAddresses',
      sequelize,
    },
  );

  return WarehouseAddressModel;
}
