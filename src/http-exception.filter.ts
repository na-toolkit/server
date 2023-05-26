import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { isDev } from '@config/configuration';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private isDev = isDev();

  catch(exception: HttpException, host: ArgumentsHost) {
    const contextType = host.getType<GqlContextType>();
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const otherInfo =
        typeof exceptionResponse === 'string'
          ? { debugInfo: exceptionResponse }
          : exceptionResponse;
      const stacktrace = exception.stack?.split('\n');

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(this.isDev ? { ...otherInfo, stacktrace } : {}),
      });
    }
  }
}
