import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
