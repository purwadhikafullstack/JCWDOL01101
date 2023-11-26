import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { UserModel } from './user.model';
import { InventoryModel } from './inventory.model';

export class WarehouseModel extends Model<Warehouse> implements Warehouse {
  public id: number;
  public name: string;
  public capacity: number;
  public warehouseAddressId?:number;
  public userId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      userId:{
        allowNull: true,
        type: DataTypes.INTEGER,
      }
      
    },
    {
      tableName: 'warehouses',
      sequelize,
    },
  );
 
  return WarehouseModel;
}