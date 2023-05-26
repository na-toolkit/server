import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CustomConfigService } from '../custom-config/custom-config.service';
import { join } from 'node:path';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ExceptionExtensions } from '@/utils/generalHttpException';
import { GraphQLError } from 'graphql';
import { isDev } from '@config/configuration';

interface GraphQLErrorSpecifyExtensions extends GraphQLError {
  extensions: ExceptionExtensions & { stacktrace: string[] };
}

const isDevRes = isDev();

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => ({
        debug: configService.get('isDev'),
        playground: false,
        sortSchema: true,
        autoSchemaFile: join(process.cwd(), './schema.gql'),
        plugins: [
          configService.get('isDev')
            ? ApolloServerPluginLandingPageLocalDefault()
            : ApolloServerPluginLandingPageProductionDefault(),
        ],
        formatError: (error: GraphQLErrorSpecifyExtensions) => {
          const { message, locations, path, extensions } = error;
          const { statusCode, messageCode, debugInfo, stacktrace } = extensions;
          return {
            message,
            locations,
            path,
            extensions: {
              statusCode,
              messageCode,
              ...(isDevRes ? { debugInfo, stacktrace } : {}),
            },
          };
        },
      }),
    }),
  ],
})
export class CustomGraphqlModule {}
