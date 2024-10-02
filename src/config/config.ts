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
      username: getEnvVar('DB_USER'),       // Get from env
      password: '',   // Get from env
      database: getEnvVar('DB_NAME'),       // Get from env
      host: getEnvVar('DB_HOST'),           // Get from env
      dialect: getEnvVar('DB_DIALECT'),     // Get from env
    },
    corsOrigin: getEnvVar('CORS_ORIGIN'),   // Get from env
    swaggerUrl: getEnvVar('SWAGGER_URL'),   // Get from env
  },
  production: {
    db: {
      username: getEnvVar('DB_USER'),       // Get from env
      password: getEnvVar('DB_PASSWORD'),   // Get from env
      database: getEnvVar('DB_NAME'),       // Get from env
      host: getEnvVar('DB_HOST'),           // Get from env
      dialect: getEnvVar('DB_DIALECT'),     // Get from env
    },
    corsOrigin: getEnvVar('CORS_ORIGIN'),   // Get from env
    swaggerUrl: getEnvVar('SWAGGER_URL'),   // Get from env
  },
};

const currentEnv: Env = (process.env.NODE_ENV as Env) || 'development';
export default config[currentEnv];
