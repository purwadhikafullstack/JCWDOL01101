import { Address } from '@/interfaces/address.interface';
import { DataTypes, Model, Op, Sequelize } from 'sequelize';

export class AddressModel extends Model<Address> implements Address {
  public id?: number;
  public recepient: string;
  public phone: string;
  public label: string;
  public lat: number;
  public lng: number;
  public cityId: string;
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
      cityId: {
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
      lat: {
        allowNull: false,
        type: DataTypes.FLOAT(10, 6),
      },
      lng: {
        allowNull: false,
        type: DataTypes.FLOAT(10, 6),
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
      paranoid: true,
      hooks: {
        afterCreate: async (address, options) => {
          if (address.isMain) {
            await AddressModel.update(
              {
                isMain: false,
              },
              {
                where: {
                  id: {
                    [Op.not]: address.id,
                  },
                },
                transaction: options.transaction,
              },
            );
          }
        },
      },
    },
  );

  return AddressModel;
}
