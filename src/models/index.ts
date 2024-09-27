import sequelize from '../config/database';
import User from './user/user.model';
import defineAssociationsDynamically from '../associations';
import Payment from './user/payment.model';
import AccountDetails from './user/account.model';

const models = {
  User,
  Payment,
  AccountDetails
};

const modelAssociations = {
  User: {
    hasMany: [
      {
        targetModel: 'Payment',
        foreignKey: 'userId',
        as: 'payments' // Alias for the payments relationship
      },
      {
        targetModel: 'AccountDetails',
        foreignKey: 'userId',
        as: 'accountDetails' // Alias for the account details relationship
      }
    ]
  },
  Payment: {
    belongsTo: [
      {
        targetModel: 'User',
        foreignKey: 'userId',
        as: 'user' // Alias for the reverse relationship (user)
      }
    ]
  },
  AccountDetails: {
    belongsTo: [
      {
        targetModel: 'User',
        foreignKey: 'userId',
        as: 'user' // Alias for the reverse relationship (user)
      }
    ]
  }
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
