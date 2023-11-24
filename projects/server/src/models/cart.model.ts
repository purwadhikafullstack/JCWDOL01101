import { Status } from '@/interfaces';
import { Cart } from '@/interfaces/cart.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class CartModel extends Model<Cart> implements Cart {
  public id?: number;
  public userId: number;
  public status: Status;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CartModel {
  CartModel.init(
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
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
    },
    { tableName: 'cart', sequelize },
  );

  return CartModel;
}
