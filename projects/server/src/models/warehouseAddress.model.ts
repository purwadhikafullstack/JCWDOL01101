import { Sequelize, DataTypes, Model } from 'sequelize';
import { WarehouseAddress } from '@/interfaces/warehouseAddress.interface';

export class WarehouseAddressModel extends Model<WarehouseAddress> implements WarehouseAddress {
  public id: number;
  public addressDetail: string;
  public cityId: string;
  public provinceId: string;
  public longitude: number;
  public latitude: number;
  public isActive: boolean;

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
