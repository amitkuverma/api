type Env = 'development' | 'production';

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
  development: {
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
  production: {
    db: {
      username: 'prod_user',
      password: 'prod_pass',
      database: 'prod_db',
      host: 'prod_db_host',
      dialect: 'mysql',
    },
    corsOrigin: '*',
    swaggerUrl: `https://api-18dg.onrender.com/`,
  },
};

const currentEnv: Env = (process.env.NODE_ENV as Env) || 'development';
export default config[currentEnv];
