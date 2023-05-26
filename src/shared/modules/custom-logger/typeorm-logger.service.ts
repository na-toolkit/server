import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  QueryRunner,
  LogLevel as TypeormLogLevel,
  AbstractLogger,
  LogMessage,
} from 'typeorm';
import { gray, underline, yellow, red } from 'colorette';
import { CustomConfigService } from '../custom-config/custom-config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class TypeormLoggerService extends AbstractLogger {
  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: CustomConfigService,
  ) {
    super(configService.get('database.logging'));
    this.logger.setContext(TypeormLoggerService.name);
  }

  protected writeLog(
    level: TypeormLogLevel,
    logMessage: LogMessage | LogMessage[],
    queryRunner?: QueryRunner,
  ) {
    const messages = this.prepareLogMessages(logMessage);

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.logger.debug(String(message.message));
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            this.logger.debug(
              `${underline(gray(message.prefix))} ${message.message}`,
            );
          } else {
            this.logger.debug(String(message.message));
          }
          break;

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            this.logger.warn(
              `${underline(yellow(message.prefix))} ${message.message}`,
            );
          } else {
            this.logger.warn(String(message.message));
          }
          break;

        case 'error':
        case 'query-error':
          if (message.prefix) {
            this.logger.error(
              `${underline(red(message.prefix))} ${message.message}`,
            );
          } else {
            this.logger.error(String(message.message));
          }
          break;
      }
    }
  }
}
