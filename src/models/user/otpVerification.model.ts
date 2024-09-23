import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class OtpVerification extends Model {
  public id!: number;
  public userId!: number;
  public otp!: string;
  public verified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

OtpVerification.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users', // Reference the `users` table
      key: 'userId',  // Correct foreign key reference to `userId`
    },
    onDelete: 'CASCADE', // Automatically delete OTP records when the user is deleted
    onUpdate: 'CASCADE',
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'OtpVerification',
  tableName: 'otp_verifications',
  timestamps: true, // Enable `createdAt` and `updatedAt`
});

export default OtpVerification;
