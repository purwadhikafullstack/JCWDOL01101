import { Order } from '@/interfaces/order.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderModel extends Model<Order> implements Order {
  public id?: number;
  public userId: number;
  public warehouseId?: number;
  public invoice: string;
  public totalPrice: number;
  public shippingFee: number;
  public status: string;
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
      warehouseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['PENDING', 'WAITING', 'PROCESS', 'DELIVERED', 'SHIPPED', 'FAILED', 'CANCELED', 'REJECTED'],
      },
      totalPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      shippingFee: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      invoice: {
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
