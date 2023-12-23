import { Sequelize, DataTypes, Model } from 'sequelize';
import { Inventory } from '@/interfaces/inventory.interface';
import SizeModel from './size.model';
import ProductModel from './product.model';
import WarehouseModel from './warehouse.model';
import { Status } from '@/interfaces';

export class InventoryModel extends Model<Inventory> implements Inventory {
  public id: number;
  public sizeId: number;
  public warehouseId: number;
  public productId: number;
  public stock: number;
  public sold: number;
  public status: Status;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof InventoryModel {
  InventoryModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      warehouseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: WarehouseModel(sequelize),
          key: 'id',
        },
      },
      sizeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: SizeModel(sequelize),
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: ProductModel(sequelize),
          key: 'id',
        },
      },
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sold: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'inventories',
      indexes: [
        {
          unique: true,
          fields: ['warehouse_id', 'product_id', 'size_id'],
        },
      ],
    },
  );

  return InventoryModel;
}
