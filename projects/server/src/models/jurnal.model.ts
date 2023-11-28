import { Jurnal } from '@/interfaces/jurnal.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class JurnalModel extends Model<Jurnal> implements Jurnal {
  public id?: number;
  public inventoryId?: number;
  public quantity: number;
  public type: 'ADD' | 'REMOVE';
  public date: Date;
  public notes?: string;
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
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['ADD', 'REMOVE'],
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
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
