import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Address } from '@/interfaces/address.interface';
import { WarehouseModel } from './warehouse.model';

export class AddressModel extends Model<Address> implements Address {
  public id: number;
  public address: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof AddressModel {
    AddressModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
    },
    {
      tableName: 'addresses',
      sequelize,
    },
  );

  // AddressModel.hasOne(WarehouseModel, {
  //   foreignKey: "address_id",
  // });
  
  // WarehouseModel.belongsTo(AddressModel, {
  //   foreignKey: "address_id",
  // });
  
 

  return AddressModel;
}