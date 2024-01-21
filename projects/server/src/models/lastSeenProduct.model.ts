import { LastSeenProducts } from '@/interfaces/lastSeenProducts.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class LastSeenProductModel extends Model<LastSeenProducts> implements LastSeenProducts {
  declare id: number;
  declare productId: number;
  declare userId: number;
  declare timestamp: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof LastSeenProductModel {
  LastSeenProductModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'last_seen_products',
    },
  );

  return LastSeenProductModel;
}
