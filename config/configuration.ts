import * as Joi from 'joi';

interface Env {
  MODE: 'test' | 'develop' | 'prod';
}

export const validationSchema = Joi.object<Env, true>({
  MODE: Joi.string().required().valid('test', 'develop', 'prod'),
});

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

export interface Configuration {
  mode: 'test' | 'develop' | 'prod';
  isDev: boolean;
}

export const config = (): Configuration => {
  return {
    mode: process.env.MODE,
    isDev: process.env.MODE !== 'prod',
  };
};
