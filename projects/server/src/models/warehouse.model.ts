import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Warehouse } from '@/interfaces/warehouse.interface';

export class WarehouseModel extends Model<Warehouse> implements Warehouse {
  public id: number;
  public name: string;
  public capacity: number;
  // public addressId?:number;

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
      // addressId: {
      //   allowNull: true,
      //   type: DataTypes.INTEGER,
      // },
      
    },
    {
      tableName: 'warehouses',
      sequelize,
    },
  );
 
  

  return WarehouseModel;
}