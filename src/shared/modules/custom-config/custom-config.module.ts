import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config, validationSchema } from '@config/configuration';
import { CustomConfigService } from './custom-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema,
      load: [config],
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
