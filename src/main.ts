import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import morgan from 'morgan';
import { APP_PORT } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(morgan('dev'));

  app.enableCors({});
  await app.listen(APP_PORT, () => {
    Logger.log(`Server is running on port ${APP_PORT}`);
  });
}
bootstrap();
