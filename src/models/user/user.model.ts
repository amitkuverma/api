import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public filename?: string;
  public filepath?: string;
  public mimetype?: string;
  public referralCode?: string; // Optional field
  public parentUserId?: number | null; // Optional foreign key reference
  public otp?: string; // Optional OTP field
  public emailVerified!: boolean;
  public status!: string;
  public isAdmin!: boolean;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
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
  parentUserId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users', // This should refer to the table name, not the model
      key: 'userId',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "pending" // Fixed typo here
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export default User;
