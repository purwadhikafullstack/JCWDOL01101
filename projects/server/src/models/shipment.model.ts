import { DataTypes, Model, Sequelize } from 'sequelize';
import { Shipment } from '@/interfaces/shipment.interface';

export class ShipmentModel extends Model<Shipment> implements Shipment {
  public id?: number;
  public orderId?: number;
  public status: string;
  public fee: number;
  public courier: string;
  public etd: string;
}

export default function (sequelize: Sequelize): typeof ShipmentModel {
  ShipmentModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fee: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      courier: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      etd: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    { sequelize, tableName: 'shipment' },
  );

  return ShipmentModel;
}
