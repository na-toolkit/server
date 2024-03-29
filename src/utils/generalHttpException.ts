import { defaultInfoByHttpStatus } from '@/const/defaultInfoByHttpStatus';
import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import {
  HttpException,
  HttpStatus,
  HttpExceptionOptions,
} from '@nestjs/common';
import { isPlainObject } from 'lodash';

export type ExceptionExtensions = {
  statusCode: HttpStatus;
  code: string;
  messageCode?: ErrorMessageCode;
  debugInfo?: string | object | any;
};

class GeneralHttpException extends HttpException {
  public readonly extensions: ExceptionExtensions;
  public readonly message: string;

  public static getDefaultInfoByHttpStatus<
    T extends keyof typeof defaultInfoByHttpStatus,
  >(type: T): typeof defaultInfoByHttpStatus[T] {
    return defaultInfoByHttpStatus[type];
  }

  constructor(
    type: keyof typeof defaultInfoByHttpStatus,
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    const {
      statusCode,
      description: defaultDescription,
      messageCode: defaultMessageCode,
    } = GeneralHttpException.getDefaultInfoByHttpStatus(type);

    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(
        descriptionOrOptions || defaultDescription,
      );

    const messageCode =
      (isPlainObject(objectOrError) &&
        (objectOrError['messageCode'] as ErrorMessageCode)) ||
      defaultMessageCode;

    super(
      HttpException.createBody(
        { messageCode, debugInfo: objectOrError },
        description,
        statusCode,
      ),
      statusCode,
      httpExceptionOptions,
    );

    this.message = defaultDescription;
    this.extensions = {
      statusCode,
      messageCode,
      code: defaultDescription,
      debugInfo: objectOrError,
    };
  }
}

type ObjectOrError = {
  messageCode?: string;
  log?: string;
  variables?: Record<string, string>;
  isProduction?: boolean;
};

export const handleGeneralException = (
  type: keyof typeof defaultInfoByHttpStatus,
  objectOrError?: ObjectOrError,
  descriptionOrOptions?: string | HttpExceptionOptions,
) => {
  return new GeneralHttpException(type, objectOrError, descriptionOrOptions);
};

// export const handleBadRequestException = ({
//   messageCode,
//   log,
//   variables,
//   isProduction,
// }: {
//   messageCode: string;
//   log?: string;
//   variables?: Record<string, string>;
//   isProduction?: boolean;
// }) => {
//   return new BadRequestException({
//     statusCode: 400,
//     messageCode,
//     log,
//     variables,
//     isProduction,
//   });
// };

// export const handleUnauthorizedException = (
//   input: {
//     messageCode?: string;
//     log?: string;
//     isProduction?: boolean;
//   } = {
//     messageCode: ErrorMessageCode.UNAUTHORIZED,
//   },
// ) => {
//   const {
//     messageCode = ErrorMessageCode.UNAUTHORIZED,
//     log,
//     isProduction,
//   } = input;
//   return new UnauthorizedException({
//     statusCode: 401,
//     messageCode,
//     log,
//     isProduction,
//   });
// };

// export const handleForbiddenException = (
//   input: {
//     messageCode?: string;
//     log?: string;
//     isProduction?: boolean;
//   } = {
//     messageCode: ErrorMessageCode.FORBIDDEN,
//   },
// ) => {
//   const { messageCode = ErrorMessageCode.FORBIDDEN, log, isProduction } = input;
//   return new ForbiddenException({
//     statusCode: 403,
//     messageCode,
//     log,
//     isProduction,
//   });
// };

// export const handleNotFoundException = (
//   input: {
//     messageCode?: string;
//     log?: string;
//     isProduction?: boolean;
//   } = {
//     messageCode: ErrorMessageCode.NOT_FOUND,
//   },
// ) => {
//   const { messageCode = ErrorMessageCode.NOT_FOUND, log, isProduction } = input;
//   return new NotFoundException({
//     statusCode: 404,
//     messageCode,
//     log,
//     isProduction,
//   });
// };

// export const handlePayloadTooLargeException = (
//   input: {
//     messageCode?: string;
//     log?: string;
//     variables?: Record<string, string>;
//     isProduction?: boolean;
//   } = {
//     messageCode: ErrorMessageCode.PAYLOAD_TOO_LARGE,
//     variables: {},
//   },
// ) => {
//   const {
//     messageCode = ErrorMessageCode.PAYLOAD_TOO_LARGE,
//     log,
//     variables = {},
//     isProduction,
//   } = input;
//   return new PayloadTooLargeException({
//     statusCode: 413,
//     messageCode,
//     log,
//     variables,
//     isProduction,
//   });
// };

// export const handleInternalServerErrorException = (
//   input: {
//     messageCode?: string;
//     log?: string;
//     isProduction?: boolean;
//   } = {
//     messageCode: ErrorMessageCode.SERVER_ERROR,
//   },
// ) => {
//   const {
//     messageCode = ErrorMessageCode.SERVER_ERROR,
//     log,
//     isProduction,
//   } = input;
//   return new InternalServerErrorException({
//     statusCode: 500,
//     messageCode,
//     log,
//     isProduction,
//   });
// };
