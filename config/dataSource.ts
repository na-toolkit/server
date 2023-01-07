import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({});

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvDatabase {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

export interface EnvDatabase {
  TYPEORM_TYPE: 'mysql';
  TYPEORM_HOST: string;
  TYPEORM_PORT: string;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
  TYPEORM_ENTITIES: string;
  TYPEORM_MIGRATIONS: string;
}

export const getDatabase = (env: EnvDatabase): DataSourceOptions => ({
  type: env.TYPEORM_TYPE,
  host: env.TYPEORM_HOST,
  port: +env.TYPEORM_PORT,
  logger: 'advanced-console',
  logging: true,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  charset: 'utf8mb4_unicode_ci',
  timezone: 'Z',
  database: env.TYPEORM_DATABASE,
  entities: [env.TYPEORM_ENTITIES],
  synchronize: false,
  migrationsRun: false,
});

export default new DataSource({
  ...getDatabase(process.env),
  migrations: [process.env.TYPEORM_MIGRATIONS],
});
