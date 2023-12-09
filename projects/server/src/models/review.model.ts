import { Review } from '@/interfaces/review.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ReviewModel extends Model<Review> implements Review {
  public id?: number;
  public productId?: number;
  public userId: number;
  public rating: number;
  public nickname: string;
  public title: string;
  public comment: string;
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
      comment: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    { sequelize, tableName: 'reviews' },
  );

  return ReviewModel;
}
