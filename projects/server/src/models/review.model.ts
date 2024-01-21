import { Status } from '@/interfaces';
import { Review } from '@/interfaces/review.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ReviewModel extends Model<Review> implements Review {
  declare id?: number;
  declare productId?: number;
  declare userId: number;
  declare rating: number;
  declare nickname: string;
  declare title: string;
  declare status: Status;
  declare comment: string;
}

export default function (sequelize: Sequelize): typeof ReviewModel {
  ReviewModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      rating: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
      comment: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    { sequelize, tableName: 'reviews' },
  );

  return ReviewModel;
}
