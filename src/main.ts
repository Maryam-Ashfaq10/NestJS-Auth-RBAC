import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // strips properties not in the DTO
    forbidNonWhitelisted: true, // throws if extra properties are sent
    transform: true,        // auto-transforms payloads to DTO instances
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
   // --- Swagger setup ---
  const config = new DocumentBuilder()
    .setTitle('NestJS RBAC API')
    .setDescription('Demo API with JWT auth and role-based access control')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
