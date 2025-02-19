import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';


async function bootstrap() {

  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  app.useGlobalPipes(  
    new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true, 
    }) 
  );


  await app.listen( envs.port);
  logger.log (`App running om port ${ envs.port}`);
}
bootstrap();
