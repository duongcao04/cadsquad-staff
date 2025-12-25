import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: false, // Required for Better Auth
  });

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: String(process.env.CLIENT_URL),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Accept send cookie / Authorization headers
  })

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
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()))

  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API docs setup
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Api Docs')
    .setDescription('Api Documentation for Backend Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(Number(process.env.BACKEND_PORT || 3000), () => {
    console.log(`App running on port:::${Number(process.env.BACKEND_PORT)}`)
  });
}
void bootstrap();