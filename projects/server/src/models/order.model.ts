import { Order } from '@/interfaces/order.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderModel extends Model<Order> implements Order {
  declare id?: number;
  declare userId: number;
  declare warehouseId?: number;
  declare invoice: string;
  declare totalPrice: number;
  declare shippingFee: number;
  declare status: string;
  declare deletedAt: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
        values: ['PENDING', 'WAITING', 'PROCESS', 'SHIPPED', 'DELIVERED', 'SUCCESS', 'FAILED', 'CANCELED', 'REJECTED'],
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
