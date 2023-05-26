import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import { HttpStatus } from '@nestjs/common';

export const defaultInfoByHttpStatus = {
  OK: {
    statusCode: HttpStatus.OK,
    description: 'OK',
    messageCode: undefined,
  },
  CREATED: {
    statusCode: HttpStatus.CREATED,
    description: 'Created',
    messageCode: undefined,
  },
  BAD_REQUEST: {
    statusCode: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    messageCode: ErrorMessageCode.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    messageCode: ErrorMessageCode.UNAUTHORIZED,
  },
  FORBIDDEN: {
    statusCode: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    messageCode: ErrorMessageCode.FORBIDDEN,
  },
  NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    messageCode: ErrorMessageCode.NOT_FOUND,
  },
  PAYLOAD_TOO_LARGE: {
    statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'Payload Too Large',
    messageCode: ErrorMessageCode.PAYLOAD_TOO_LARGE,
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    messageCode: ErrorMessageCode.SERVER_ERROR,
  },
  NOT_IMPLEMENTED: {
    statusCode: HttpStatus.NOT_IMPLEMENTED,
    description: 'Not Implemented',
    messageCode: undefined,
  },
  BAD_GATEWAY: {
    statusCode: HttpStatus.BAD_GATEWAY,
    description: 'Bad Gateway',
    messageCode: undefined,
  },
  SERVICE_UNAVAILABLE: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Service Unavailable',
    messageCode: undefined,
  },
  GATEWAY_TIMEOUT: {
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Gateway Timeout',
    messageCode: undefined,
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    statusCode: HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
    description: 'Http Version Not Supported',
    messageCode: undefined,
  },
} as const;
