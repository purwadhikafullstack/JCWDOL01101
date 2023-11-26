import { Order } from '@/interfaces/order.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderModel extends Model<Order> implements Order {
  public id?: number;
  public userId: number;
  public payment: string;
  public deletedAt: Date;
}

export default function (sequelize: Sequelize): typeof OrderModel {
  OrderModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      payment: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    { tableName: 'orders', sequelize },
  );

  return OrderModel;
}
