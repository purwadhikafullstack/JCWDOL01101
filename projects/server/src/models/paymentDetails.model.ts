import { Payment } from '@/interfaces/payment.interface';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class PaymentDetailsModel extends Model<Payment> implements Payment {
  public id?: number;
  public orderId?: number;
  public method: string;
  public virtualAccount: string;
  public status: string;
  public paymentDate: Date;
}

export default function (sequelize: Sequelize): typeof PaymentDetailsModel {
  PaymentDetailsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      virtualAccount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { sequelize, paranoid: true, tableName: 'payment_details' },
  );

  return PaymentDetailsModel;
}
