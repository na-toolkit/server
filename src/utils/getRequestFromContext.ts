import { CustomRequest } from '@/shared/types/customRequest';
import { type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext, type GqlContextType } from '@nestjs/graphql';

export const getRequestFromContext = (
  context: ExecutionContext,
): CustomRequest | undefined => {
  const contextType = context.getType<GqlContextType>();
  let request: CustomRequest | undefined = undefined;
  if (contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    request = ctx.getContext()?.req;
  } else if (contextType === 'http') {
    request = context.switchToHttp().getRequest();
  }
  return request;
};
