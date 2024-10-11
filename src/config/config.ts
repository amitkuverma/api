import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

type Env = 'development' | 'production';

// Helper function to get environment variables and throw an error if undefined
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

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
      username: 'sql12732393',       // Get from env
      password: 'tC6TIGpLNs',   // Get from env
      database: 'sql12732393',       // Get from env
      host: 'sql12.freesqldatabase.com',           // Get from env
      dialect: 'mysql',     // Get from env
    },
    corsOrigin: 'https://api.gorkhacoin.com',   // Get from env
    swaggerUrl: 'https://api.gorkhacoin.com',    // Get from env
  },
  production: {
    db: {
      username: 'sql12732393',       // Get from env
      password: 'tC6TIGpLNs',   // Get from env
      database: 'sql12732393',       // Get from env
      host: 'sql12.freesqldatabase.com',           // Get from env
      dialect: 'mysql',     // Get from env
    },
    corsOrigin: 'https://api.gorkhacoin.com',   // Get from env
    swaggerUrl: 'https://api.gorkhacoin.com',   // Get from env
  },
};

const currentEnv: Env = (process.env.NODE_ENV as Env) || 'development';
export default config[currentEnv];
