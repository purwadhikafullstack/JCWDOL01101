import { Mutation } from '@/interfaces/mutation.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class MutationModel extends Model<Mutation> implements Mutation {
  declare id?: number;
  declare senderWarehouseId?: number;
  declare receiverWarehouseId?: number;
  declare senderName: string;
  declare receiverName?: string;
  declare productId?: number;
  declare sizeId: number;
  declare quantity: number;
  declare senderNotes?: string;
  declare receiverNotes?: string;
  declare status: 'ONGOING' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
}

export default function (sequelize: Sequelize): typeof MutationModel {
  MutationModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      senderWarehouseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      receiverWarehouseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      senderName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      receiverName: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sizeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      senderNotes: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      receiverNotes: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['ONGOING', 'COMPLETED', 'REJECTED', 'CANCELED'],
      },
    },
    { sequelize, tableName: 'mutations' },
  );

  return MutationModel;
}
