import { Mutation } from '@/interfaces/mutation.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class MutationModel extends Model<Mutation> implements Mutation {
  public id?: number;
  public senderWarehouseId?: number;
  public receiverWarehouseId?: number;
  public senderName: string;
  public receiverName?: string;
  public productId?: number;
  public quantity: number;
  public senderNotes?: string;
  public receiverNotes?: string;
  public status: 'ONGOING' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
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
