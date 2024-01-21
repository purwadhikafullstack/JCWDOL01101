import { Image } from '@/interfaces/image.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ImageModel extends Model<Image> implements Image {
  declare id?: number;
  declare productId?: number;
  declare image: string;
}

export default function (sequelize: Sequelize): typeof ImageModel {
  ImageModel.init(
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
      image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    { sequelize, tableName: 'product_images' },
  );

  return ImageModel;
}
