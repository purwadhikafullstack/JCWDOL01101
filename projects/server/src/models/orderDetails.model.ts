import { OrderDetails } from '@/interfaces/orderDetails.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderDetailsModel extends Model<OrderDetails> implements OrderDetails {
  public id?: number;
  public orderId?: number;
  public productId?: number;
  public quantity: number;
  public price: number;
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
    { sequelize, tableName: 'order_details' },
  );
  return OrderDetailsModel;
}
