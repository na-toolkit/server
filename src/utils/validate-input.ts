import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import * as Joi from 'joi';
import { handleBadRequestException } from './formatException';

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
    throw handleBadRequestException({
      messageCode: ErrorMessageCode.BAD_REQUEST,
      log: err,
    });
  }
};
