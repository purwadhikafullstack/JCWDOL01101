import { Sequelize, DataTypes, Model } from 'sequelize';
import { User } from '@interfaces/users.interface';

export class UserModel extends Model<User> implements User {
  public id: number;
  public name: string;
  public role: 'user' | 'warehouse' | 'admin';
  public status: 'active' | 'disabled';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'warehouse', 'admin'],
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.ENUM,
        values: ['active', 'deleted'],
        defaultValue: 'active',
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
