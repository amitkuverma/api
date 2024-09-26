import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Payment extends Model {
  public paymentId!: number;
  public userId!: number;
  public amount!: number;
  public paymentMethod!: string;
  public transactionId!: string;
  public status!: string;
  public receipt?: string; // New field to store the receipt path
  public createdAt!: Date;
}

Payment.init({
  paymentId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId',
    },
    onDelete: 'CASCADE',
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
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receipt: { // New receipt column
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: true,
});

export default Payment;
