import * as Joi from 'joi';
import { handleGeneralException } from './generalHttpException';

export const validateInput = async <T>({
  schema,
  input,
}: {
  schema: (joi: typeof Joi) => Joi.ObjectSchema<T>;
  input: T;
}) => {
  try {
    const validateSchema = await schema(Joi);
    await validateSchema.validateAsync(input);
  } catch (err) {
    throw handleGeneralException('BAD_REQUEST', {
      log: err?.message,
    });
  }
};
