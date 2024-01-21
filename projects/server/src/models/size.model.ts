import { Size } from '@/interfaces/size.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SizeModel extends Model<Size> implements Size {
  declare id: number;
  declare label: string;
  declare value: number;
}

export default function (sequelize: Sequelize): typeof SizeModel {
  SizeModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      label: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      value: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, tableName: 'size', timestamps: false },
  );

  return SizeModel;
}
