import { OrderProduct } from '@/interfaces/orderProduct.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderProdcutModel extends Model<OrderProduct> implements OrderProduct {
  public id?: number;
  public orderId?: number;
  public productId?: number;
  public quantity: number;
  public price: number;
}

export default function (sequelize: Sequelize): typeof OrderProdcutModel {
  OrderProdcutModel.init(
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
    { sequelize, tableName: 'order_products' },
  );
  return OrderProdcutModel;
}
