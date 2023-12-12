import { Jurnal } from '@/interfaces/jurnal.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class JurnalModel extends Model<Jurnal> implements Jurnal {
  public id?: number;
  public warehouseId?: number;
  public inventoryId?: number;
  public oldQty: number;
  public qtyChange: number;
  public newQty: number;
  public type: 'STOCK IN' | 'STOCK OUT';
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
      warehouseId: {
        allowNull: false,
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
        values: ['STOCK IN', 'STOCK OUT'],
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
