import { CartProduct } from '@/interfaces/cartProduct.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';
import CartModel from './cart.model';
import ProductModel from './product.model';
import SizeModel from './size.model';
import { Status } from '@/interfaces';

export class CartProductModel extends Model<CartProduct> implements CartProduct {
  public id?: number;
  public cartId: number;
  public sizeId: number;
  public productId: number;
  public quantity: number;
  public status: Status;
  public price: number;
  public selected: boolean;
}

export default function (sequelize: Sequelize): typeof CartProductModel {
  CartProductModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      sizeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: SizeModel(sequelize),
          key: 'id',
        },
      },
      cartId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: CartModel(sequelize),
          key: 'id',
        },
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: ProductModel(sequelize),
          key: 'id',
        },
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      selected: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
    },

    { tableName: 'cart_product', sequelize, timestamps: false, indexes: [{ unique: true, fields: ['cart_id', 'product_id', 'size_id'] }] },
  );

  return CartProductModel;
}
