import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import {
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';

export const handleBadRequestException = ({
  messageCode,
  log,
  variables,
  isProduction,
}: {
  messageCode: string;
  log?: string;
  variables?: Record<string, string>;
  isProduction?: boolean;
}) => {
  return new BadRequestException({
    statusCode: 400,
    messageCode,
    log,
    variables,
    isProduction,
  });
};

export const handleUnauthorizedException = (
  input: {
    messageCode?: string;
    log?: string;
    isProduction?: boolean;
  } = {
    messageCode: ErrorMessageCode.UNAUTHORIZED,
  },
) => {
  const {
    messageCode = ErrorMessageCode.UNAUTHORIZED,
    log,
    isProduction,
  } = input;
  return new UnauthorizedException({
    statusCode: 401,
    messageCode,
    log,
    isProduction,
  });
};

export const handleForbiddenException = (
  input: {
    messageCode?: string;
    log?: string;
    isProduction?: boolean;
  } = {
    messageCode: ErrorMessageCode.FORBIDDEN,
  },
) => {
  const { messageCode = ErrorMessageCode.FORBIDDEN, log, isProduction } = input;
  return new ForbiddenException({
    statusCode: 403,
    messageCode,
    log,
    isProduction,
  });
};

export const handleNotFoundException = (
  input: {
    messageCode?: string;
    log?: string;
    isProduction?: boolean;
  } = {
    messageCode: ErrorMessageCode.NOT_FOUND,
  },
) => {
  const { messageCode = ErrorMessageCode.NOT_FOUND, log, isProduction } = input;
  return new NotFoundException({
    statusCode: 404,
    messageCode,
    log,
    isProduction,
  });
};

export const handlePayloadTooLargeException = (
  input: {
    messageCode?: string;
    log?: string;
    variables?: Record<string, string>;
    isProduction?: boolean;
  } = {
    messageCode: ErrorMessageCode.PAYLOAD_TOO_LARGE,
    variables: {},
  },
) => {
  const {
    messageCode = ErrorMessageCode.PAYLOAD_TOO_LARGE,
    log,
    variables = {},
    isProduction,
  } = input;
  return new PayloadTooLargeException({
    statusCode: 413,
    messageCode,
    log,
    variables,
    isProduction,
  });
};

export const handleInternalServerErrorException = (
  input: {
    messageCode?: string;
    log?: string;
    isProduction?: boolean;
  } = {
    messageCode: ErrorMessageCode.SERVER_ERROR,
  },
) => {
  const {
    messageCode = ErrorMessageCode.SERVER_ERROR,
    log,
    isProduction,
  } = input;
  return new InternalServerErrorException({
    statusCode: 500,
    messageCode,
    log,
    isProduction,
  });
};
