import { OrderDetails } from '@/interfaces/orderDetails.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderDetailsModel extends Model<OrderDetails> implements OrderDetails {
  declare id?: number;
  declare orderId?: number;
  declare productId?: number;
  declare sizeId: number;
  declare quantity: number;
  declare price: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof OrderDetailsModel {
  OrderDetailsModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sizeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, tableName: 'order_details', indexes: [{ unique: true, fields: ['order_id', 'product_id', 'size_id'] }] },
  );
  return OrderDetailsModel;
}
