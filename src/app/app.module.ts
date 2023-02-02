import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '@/accounts/accounts.module';
import { AuthModule } from '@/auth/auth.module';
import { DateScalar } from '@/unixDate.scalar';
import { CustomConfigModule } from '@/shared/modules/custom-config/custom-config.module';
import { CustomConfigService } from '@/shared/modules/custom-config/custom-config.service';
import { SentencesModule } from '@/sentences/sentences.module';

@Module({
  imports: [
    CustomConfigModule,
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
            ? ApolloServerPluginLandingPageLocalDefault
            : ApolloServerPluginLandingPageProductionDefault,
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => {
        return configService.get('database');
      },
    }),
    AuthModule,
    AccountsModule,
    SentencesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, DateScalar],
})
export class AppModule {}
