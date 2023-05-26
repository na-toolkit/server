import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormLoggerService } from '../custom-logger/typeorm-logger.service';
import { CustomConfigService } from '../custom-config/custom-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [CustomConfigService, TypeormLoggerService],
      useFactory: async (
        configService: CustomConfigService,
        loggerService: TypeormLoggerService,
      ) => {
        return {
          ...configService.get('database'),
          logger: loggerService,
        };
      },
    }),
  ],
})
export class CustomTypeormModule {}
