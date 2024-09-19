type Env = 'localhost' | 'development' | 'production';

const config: Record<Env, { 
  db: { 
    username: string; 
    password: string; 
    database: string; 
    host: string; 
    dialect: string; 
  }; 
  corsOrigin: string; 
  swaggerUrl: string; 
}> = {
  localhost: {
    db: {
      username: 'root',
      password: '',
      database: 'kapil_coin_db',
      host: '127.0.0.1',
      dialect: 'mysql',
    },
    corsOrigin: '*',
    swaggerUrl: `http://localhost:3000/`,
  },
  development: {
    db: {
      username: 'dev_user',
      password: 'dev_pass',
      database: 'dev_db',
      host: 'dev_db_host',
      dialect: 'mysql',
    },
    corsOrigin: 'https://api-18dg.onrender.com/',
    swaggerUrl: `https://api-18dg.onrender.com/`,
  },
  production: {
    db: {
      username: 'prod_user',
      password: 'prod_pass',
      database: 'prod_db',
      host: 'prod_db_host',
      dialect: 'mysql',
    },
    corsOrigin: 'https://api-18dg.onrender.com/',
    swaggerUrl: `https://api-18dg.onrender.com/`,
  },
};

const currentEnv: Env = (process.env.NODE_ENV as Env) || 'localhost';
export default config[currentEnv];
