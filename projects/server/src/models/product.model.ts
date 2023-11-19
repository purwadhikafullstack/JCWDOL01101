import { Product } from '@/interfaces/product.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductModel extends Model<Product> implements Product {
  public id?: number;
  public categoryId?: number;
  public name: string;
  public price: number;
  public stock: number;
  public sold: number;
  public image: string;
  public weight: number;
  public description: string;
  public status: string;
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
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      weight: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
    },
    { tableName: 'products', sequelize },
  );

  return ProductModel;
}
