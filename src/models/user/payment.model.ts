import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import User from './user.model'; // Ensure the import path is correct

class Payment extends Model {
  public payId!: number;
  public userId!: number;
  public totalAmount!: number;
  public paymentMethod!: string;
  public transactionId!: string;
  public status!: string;
  public receipt?: string;
}

Payment.init({
  payId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED, // Make sure this matches the User model
    allowNull: false,
    references: {
      model: 'users', // This should refer to the table name, not the model
      key: 'userId',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receipt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: true, // Optional: if you want createdAt and updatedAt
});

export default Payment;
