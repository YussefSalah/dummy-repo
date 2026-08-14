// src/main.ts
import { init } from "@ravyn-team/node";

init({
  dsn: "https://a054bad0878fc6c4d421e9ff5b57752e@ingest.ravyn-team.me/ingest/telemetry",
  service: "nestjs-project-603",
  environment: "development",
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RavynExceptionFilter } from './ravyn-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
    app.useGlobalFilters(new RavynExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The E-Commerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
