import { Jurnal } from '@/interfaces/jurnal.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class JurnalModel extends Model<Jurnal> implements Jurnal {
  declare id?: number;
  declare inventoryId?: number;
  declare oldQty: number;
  declare qtyChange: number;
  declare newQty: number;
  declare type: '1' | '0';
  declare notes?: string;
}

export default function (sequelize: Sequelize): typeof JurnalModel {
  JurnalModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      inventoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      oldQty: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      qtyChange: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      newQty: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['1', '0'],
      },
      notes: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    { sequelize, tableName: 'jurnals' },
  );

  return JurnalModel;
}
