import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AccountsModule } from '@/accounts/accounts.module';
import { AuthModule } from '@/auth/auth.module';
import { DateScalar } from '@/unixDate.scalar';
import { CustomConfigModule } from '@/shared/modules/custom-config/custom-config.module';
import { SentencesModule } from '@/sentences/sentences.module';
import { CustomLoggerModule } from '@/shared/modules/custom-logger/custom-logger.module';
import { CustomTypeormModule } from '@/shared/modules/custom-typeorm/custom-typeorm.module';
import { CustomGraphqlModule } from '@/shared/modules/custom-graphql/custom-graphql.module';

export type ErrorContent = {
  statusCode: number;
  messageCode: string;
  stacktrace: string[];
};

@Module({
  imports: [
    CustomConfigModule,
    CustomLoggerModule,
    CustomTypeormModule,
    CustomGraphqlModule,
    AuthModule,
    AccountsModule,
    SentencesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, DateScalar],
})
export class AppModule {}
