import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from './utils/getRequestFromContext';

export const JwtAccount = createParamDecorator(
  (data: void, context: ExecutionContext) => {
    const request = getRequestFromContext(context);
    return request?.account;
  },
);
