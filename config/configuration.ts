import * as Joi from 'joi';
import { type DataSourceOptions } from 'typeorm';
import { EnvDatabase, getDatabase } from './dataSource';
import type { LevelWithSilent } from 'pino';

interface Env extends EnvDatabase {
  MODE: 'test' | 'develop' | 'prod';
  JWT_SECRET: 'string';
  JWT_EXPIRES_IN: 'string';
  ORIGIN: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
}

export const validationSchema = Joi.object<Env, true>({
  MODE: Joi.string().required().valid('test', 'develop', 'prod'),
  TYPEORM_TYPE: Joi.string().required().valid('mysql'),
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_PORT: Joi.string().regex(/^\d+$/).required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_ENTITIES: Joi.string().required(),
  TYPEORM_MIGRATIONS: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  ORIGIN: Joi.string().allow(''),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().regex(/^\d+$/).required(),
});

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

interface JwtOption {
  secret: string;
  expiresIn: string;
}

interface LoggerOption {
  level: LevelWithSilent;
  ignore: string[];
  singleLine: boolean;
}

interface RedisOption {
  host: string;
  port: number;
}
export interface Configuration {
  mode: 'test' | 'develop' | 'prod';
  isDev: boolean;
  database: DataSourceOptions;
  jwt: JwtOption;
  logger: LoggerOption;
  redis: RedisOption;
}

export const isDev = () => process.env.MODE !== 'prod';

export const config = (): Configuration => {
  const isDevRes = isDev();
  return {
    mode: process.env.MODE,
    isDev: isDevRes,
    database: getDatabase(process.env),
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    logger: {
      level: isDevRes ? 'debug' : 'info',
      ignore: isDevRes ? ['pid', 'hostname'] : [],
      singleLine: isDevRes ? false : true,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    },
  };
};
