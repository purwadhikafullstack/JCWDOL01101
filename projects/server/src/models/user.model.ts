import { User } from '@/interfaces/user.interface';
import { Role, Status } from '@/interfaces';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserModel extends Model<User> implements User {
  declare id?: number;
  declare role: Role;
  declare externalId: string;
  declare username: string;
  declare firstname: string;
  declare lastname: string;
  declare imageUrl: string;
  declare email: string;
  declare status: Status;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['CUSTOMER', 'ADMIN', 'WAREHOUSE ADMIN'],
        defaultValue: 'CUSTOMER',
      },
      externalId: {
        allowNull: false,
        type: DataTypes.STRING(255),
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
