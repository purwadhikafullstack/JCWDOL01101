import { Address } from '@/interfaces/address.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class AddressModel extends Model<Address> implements Address {
  public id?: number;
  public recepient: string;
  public phone: string;
  public label: string;
  public city: string;
  public address: string;
  public isMain: boolean;
  public isActive: boolean;
  public deletedAt: Date;
  public notes?: string;
}

export default function (sequelize: Sequelize): typeof AddressModel {
  AddressModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      recepient: {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING(15),
      },
      label: {
        allowNull: false,
        type: DataTypes.STRING(15),
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      notes: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      isMain: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'address',
    },
  );

  return AddressModel;
}
