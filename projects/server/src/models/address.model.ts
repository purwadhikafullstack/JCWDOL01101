import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Address } from '@/interfaces/address.interface';
import { WarehouseModel } from './warehouse.model';
import { ProvinceModel } from './province.model';

export class AddressModel extends Model<Address> implements Address {
  public id: number;
  public addressDetail: string;
  public cityId:number;
  public provinceId:number;
  

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
    },
    {
      tableName: 'addresses',
      sequelize,
    },
  );

  AddressModel.hasOne(WarehouseModel, {
    foreignKey: "addressId",
    as: 'address' // add this line
  });
  
  WarehouseModel.belongsTo(AddressModel, {
    foreignKey: "addressId",
    as: 'address' // add this line
  });

  return AddressModel;
}