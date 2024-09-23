import sequelize from '../config/database';
import User from './user/user.model';
import OTPVerification from './user/otpVerification.model';
import defineAssociationsDynamically from '../associations';

const models = {
  User,
  OTPVerification,
};

const modelAssociations = {
  User: {
    hasOne: [{ targetModel: 'OTPVerification', foreignKey: 'userId', as: 'otpVerification' }],
  },
  OTPVerification: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'user' }],
  },
};

defineAssociationsDynamically(models, modelAssociations);

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });  // Sync tables
    console.log('Models synchronized');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export { initDb, models };
