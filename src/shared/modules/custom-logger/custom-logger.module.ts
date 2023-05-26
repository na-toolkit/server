import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CustomConfigService } from '../custom-config/custom-config.service';
import { PrettyOptions } from 'pino-pretty';
import { GraphQLLoggerPlugin } from './graphql-logger.plugin';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { TypeormLoggerService } from './typeorm-logger.service';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => {
        const { level, ignore, singleLine } = configService.get('logger');
        return {
          pinoHttp: {
            level,
            customLogLevel: (req, res, err) => {
              const { statusCode } = res;
              if (err) return 'error';
              if (statusCode === undefined) return 'info';
              if (statusCode >= 400 && statusCode < 500) return 'warn';
              if (statusCode >= 500) return 'error';
              return 'info';
            },
            autoLogging: {
              ignore: (req) => req.url === '/graphql',
            },
            genReqId: (req, res) => {
              const existingID = req.id ?? req.headers['x-request-id'];
              if (existingID) return existingID;
              const id = randomUUID();
              res.setHeader('X-Request-Id', id);
              return id;
            },
            redact: ['headers.Authorization', 'headers["X-Api-Key"]'],
            transport: {
              target: resolve(__dirname, './pino-pretty-transport'),
              options: {
                colorize: true,
                singleLine,
                translateTime: "yy-mm-dd'T'HH:MM:ss'Z'",
                messageFormat: '{req.id} [{context}]{responseTime} {msg}',
                ignore: ['context', 'responseTime', 'req', ...ignore].join(','),
                errorLikeObjectKeys: ['err', 'error'],
              } as PrettyOptions,
            },
          },
        };
      },
    }),
  ],
  providers: [GraphQLLoggerPlugin, TypeormLoggerService],
  exports: [TypeormLoggerService],
})
export class CustomLoggerModule {}
