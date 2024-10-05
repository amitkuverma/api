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
    port:number;
  };
  corsOrigin: string;
  swaggerUrl: string;
}> = {
  development: {
    db: {
      username:  'sql12732393',
      password: 'tC6TIGpLNs',
      database:  'sql12732393',
      host: 'sql12.freesqldatabase.com',
      dialect: 'mysql',
      port: 3306
      // username: getEnvVar('DB_USER'),       // Get from env
      // password: getEnvVar('DB_PASSWORD'),   // Get from env
      // database: getEnvVar('DB_NAME'),       // Get from env
      // host: getEnvVar('DB_HOST'),           // Get from env
      // dialect: getEnvVar('DB_DIALECT'),     // Get from env
    },
    corsOrigin: '*',   // Get from env
    swaggerUrl: 'https://gyanvidigital.xyz/gorakha-coin-api/api-docs',   // Get from env
  },
  production: {
    db: {
      username:  'sql12732393',
      password: 'tC6TIGpLNs',
      database:  'sql12732393',
      host: 'sql12.freesqldatabase.com',
      dialect: 'mysql',
      port: 3306
    },
    corsOrigin: '*',   // Get from env
    swaggerUrl: 'https://gyanvidigital.xyz/gorakha-coin-api/api-docs',   // Get from env
  },
};

const currentEnv: Env = (process.env.NODE_ENV as Env) || 'development';
export default config[currentEnv];
