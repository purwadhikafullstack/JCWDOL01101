import { Status } from '@/interfaces';
import { Product } from '@/interfaces/product.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductModel extends Model<Product> implements Product {
  declare id?: number;
  declare categoryId?: number;
  declare name: string;
  declare price: number;
  declare weight: number;
  declare description: string;
  declare status: Status;
  declare primaryImage: string;
  declare slug: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof ProductModel {
  ProductModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
      primaryImage: {
        allowNull: true,
        type: DataTypes.STRING(256),
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      weight: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
      ],
      tableName: 'products',
    },
  );

  return ProductModel;
}
