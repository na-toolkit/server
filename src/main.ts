import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { HttpExceptionFilter } from './http-exception.filter';
import { isDev } from '@config/configuration';

async function bootstrap() {
  const isProduction = !isDev();
  const origin = isProduction
    ? (process.env.ORIGIN || '').split(',').filter((v) => v)
    : true;
  const credentials = isProduction ? true : false;
  if (origin !== true && origin.length === 0) {
    throw new Error('origin is not valid');
  }
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
    cors: { origin, methods: 'GET,HEAD,POST,OPTIONS', credentials },
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? true : false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
