import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import morgan from 'morgan';
import { APP_PORT } from './configs';
import { ApplicationExceptionFilter } from './libs/filter/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(morgan('dev'));
  //validation dto input
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ApplicationExceptionFilter());
  app.enableCors({});
  await app.listen(APP_PORT, () => {
    Logger.log(`Server is running on port ${APP_PORT}`);
  });
}
bootstrap();
