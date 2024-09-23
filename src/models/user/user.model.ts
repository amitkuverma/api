import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public referralCode?: string; // Optional field
  public parentUserId?: number | null; // Optional foreign key reference
  public otp?: string; // Optional OTP field
  public emailVerified!: boolean;
  public mobileVerified!: boolean;
  public status!:string;
  public isAdmin!: boolean;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED, // Ensure unsigned to match the foreign key
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mobileVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  parentUserId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users', // Name of the table
      key: 'userId',  // Correct foreign key reference to `userId`
    },
    onDelete: 'SET NULL', // Handle deletion of the parent user
    onUpdate: 'CASCADE',  // Update on change
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true, // To include `createdAt` and `updatedAt` fields
});

export default User;
