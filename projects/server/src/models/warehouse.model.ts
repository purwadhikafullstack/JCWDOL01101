import { Sequelize, DataTypes, Model } from 'sequelize';
import { Warehouse } from '@/interfaces/warehouse.interface';

export class WarehouseModel extends Model<Warehouse> implements Warehouse {
  declare id: number;
  declare name: string;
  declare capacity: number;
  declare warehouseAddressId?: number;
  declare userId?: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof WarehouseModel {
  WarehouseModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      warehouseAddressId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'warehouses',
      sequelize,
    },
  );

  return WarehouseModel;
}
