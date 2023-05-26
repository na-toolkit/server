import { LogLevel } from '@nestjs/common';
import { Plugin } from '@nestjs/apollo';
import {
  GraphQLRequestListener,
  ApolloServerPlugin,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContext,
} from '@apollo/server';
import { type IncomingMessage } from 'http';
import { ExceptionExtensions } from '@/utils/generalException';
import { PinoLogger } from 'nestjs-pino';

/**
 * Keep tracking the PR: https://github.com/nestjs/nest/pull/11036
 * It will change the log level value of debug and verbose after a major release.
 * FIXME: If this PR is merged in the future, we should follow up on this correction.
 */
const LOG_LEVEL_VALUES = {
  debug: 0,
  verbose: 1,
  log: 2,
  warn: 3,
  error: 4,
} as const;

@Plugin()
export class GraphQLLoggerPlugin<TContext extends IncomingMessage>
  implements ApolloServerPlugin<TContext>
{
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GraphQLLoggerPlugin.name);
  }

  async requestDidStart(
    req: GraphQLRequestContext<TContext> & { id?: string },
  ): Promise<GraphQLRequestListener<TContext>> {
    return new RequestListener(
      {
        id: req.id,
        query: req.request.query,
        variable: req.request.variables,
        operationName: req.request.operationName,
      },
      this.logger,
    ) as GraphQLRequestListener<TContext>;
  }
}

type RequestListenerErrorObj = {
  level: LogLevel;
  errors: Array<ExceptionExtensions['originalError']>;
};

class RequestListener<TContext extends IncomingMessage>
  implements
    Pick<
      GraphQLRequestListener<TContext>,
      'didEncounterErrors' | 'willSendResponse'
    >
{
  private readonly startTime: number = Date.now();
  private successMsg = 'Request completed';
  private errorMsg = 'Request errored';
  private errorObj: RequestListenerErrorObj = {
    level: 'log',
    errors: [],
  };

  constructor(
    private readonly data: {
      id?: string;
      query?: string;
      operationName?: string;
      [arrtibuteName: string]: unknown;
    },
    private readonly logger: PinoLogger,
  ) {}

  async didEncounterErrors(
    errorsCtx: GraphQLRequestContextDidEncounterErrors<TContext>,
  ): Promise<void> {
    const { level, errors } = errorsCtx.errors.reduce<RequestListenerErrorObj>(
      (acc, cur) => {
        const { level: currentLevel, errors } = acc;
        const { statusCode, originalError } =
          cur.extensions as ExceptionExtensions;
        let errorLevel: LogLevel = 'log';
        if (statusCode >= 400 && statusCode < 500) {
          errorLevel = 'warn';
        } else if (statusCode >= 500) {
          errorLevel = 'error';
        }
        const level =
          LOG_LEVEL_VALUES[currentLevel] > LOG_LEVEL_VALUES[errorLevel]
            ? currentLevel
            : errorLevel;
        errors.push(originalError);
        return { level, errors };
      },
      { level: 'log', errors: [] },
    );
    if (errors.length) this.errorObj = { level, errors };
  }

  async willSendResponse(): Promise<void> {
    const { operationName } = this.data;
    if (operationName === 'IntrospectionQuery') return;
    const isError = this.errorObj.errors.length > 0;
    const responseTime = Date.now() - this.startTime;
    if (isError) {
      const { level, errors } = this.errorObj;
      if (level === 'warn') {
        this.logger.warn(
          { graphql: this.data, errors, responseTime },
          this.errorMsg,
        );
      } else
        this.logger.error(
          { graphql: this.data, errors, responseTime },
          this.errorMsg,
        );
    } else {
      this.logger.info({ graphql: this.data, responseTime }, this.successMsg);
    }
  }
}
