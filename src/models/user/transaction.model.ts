import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import User from './user.model'; // Ensure the import path is correct

class Transaction extends Model {
  public transId!: number;
  public userId!: number;
  public userName!: string;
  public receiverName!: string;
  public paymentType!: string;
  public transactionId!: string;
  public transactionAmount!: string;
  public status!: string;
  public receipt?: string;
  public filename?: string;
  public filepath?: string;
  public mimetype?: string;
}

Transaction.init({
  transId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED, // Matches the User model
    allowNull: false,
    references: {
      model: 'users', // This should refer to the table name, not the model name
      key: 'userId',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionAmount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions', // Ensure the correct table name
  timestamps: true, // Optional: if you want createdAt and updatedAt fields
});

export default Transaction;
