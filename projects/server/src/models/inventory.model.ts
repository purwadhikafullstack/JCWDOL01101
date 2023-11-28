import { Sequelize, DataTypes, Model } from 'sequelize';
import { Inventory } from '@/interfaces/inventory.interface';

export class InventoryModel extends Model<Inventory> implements Inventory {
  public id: number;
  public warehouseId: number;
  public stock: number;
  public sold: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof InventoryModel {
  InventoryModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      warehouseId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sold: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'inventories',
      sequelize,
    },
  );

  return InventoryModel;
}
