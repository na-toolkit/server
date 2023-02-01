import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from './utils/getRequestFromContext';

export const JwtAccount = createParamDecorator(
  (data: void, context: ExecutionContext) => {
    const request = getRequestFromContext(context);
    if (!request?.account) throw Error('帳號信息有誤');
    return request.account;
  },
);
