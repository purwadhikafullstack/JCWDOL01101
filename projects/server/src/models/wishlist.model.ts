import { Wishlist } from '@/interfaces/wishlist.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';
import ProductModel from './product.model';
import UserModel from './user.model';

export class WishlistModel extends Model<Wishlist> implements Wishlist {
  public id?: number;
  public userId: number;
  public productId: number;
  public deletedAt: Date | null;
}

export default function (sequelize: Sequelize): typeof WishlistModel {
  WishlistModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel(sequelize),
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: ProductModel(sequelize),
          key: 'id',
        },
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    { sequelize, paranoid: true, tableName: 'whislist' },
  );

  return WishlistModel;
}
