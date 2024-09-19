import sequelize from '../config/database';
import User from './user/user.model';

const models = {
  User,
};

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
