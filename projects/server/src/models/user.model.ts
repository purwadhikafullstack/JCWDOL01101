import { User } from '@/interfaces/user.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserModel extends Model<User> implements User {
  public id?: number;
  public externalId: string;
  public role: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public imageUrl: string;
  public email: string;
  public status: string;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      externalId: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['CUSTOMER', 'ADMIN', 'WAREHOUSE'],
        defaultValue: 'ACTIVE',
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      firstname: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      lastname: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      imageUrl: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
    },

    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
