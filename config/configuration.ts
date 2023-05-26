import { JwtModuleOptions } from '@nestjs/jwt';
import * as Joi from 'joi';
import { type DataSourceOptions } from 'typeorm';
import { EnvDatabase, getDatabase } from './dataSource';
import type { LevelWithSilent } from 'pino';

interface Env extends EnvDatabase {
  MODE: 'test' | 'develop' | 'prod';
  JWT_SECRET: 'string';
  JWT_EXPIRES_IN: 'string';
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
export interface Configuration {
  mode: 'test' | 'develop' | 'prod';
  isDev: boolean;
  database: DataSourceOptions;
  jwt: JwtOption;
  logger: LoggerOption;
}

export const config = (): Configuration => {
  const isDev = process.env.MODE !== 'prod';
  return {
    mode: process.env.MODE,
    isDev,
    database: getDatabase(process.env),
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    logger: {
      level: isDev ? 'debug' : 'info',
      ignore: isDev ? ['pid', 'hostname'] : [],
      singleLine: isDev ? false : true,
    },
  };
};
