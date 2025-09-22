import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      validationError: {
        target: false,
      },
      stopAtFirstError: true,
    }),
  );
  app.enableCors({
    origin: String(process.env.CLIENT_URL), // không dùng "*"
    credentials: true, // cho phép gửi cookie / Authorization headers
  })
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()))
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Api Docs')
    .setDescription('Api Documentation for Backend Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`App running on https://localhost:${Number(process.env.BACKEND_PORT)}/api/`)
  });
}
void bootstrap();
