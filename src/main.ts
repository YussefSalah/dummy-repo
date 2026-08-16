// src/main.ts
import { init } from "@ravyn-team/node";

init({
  dsn: "https://8f9c36786bf70176e2fd001ce68fc8c2@ingest.ravyn-team.me/ingest/telemetry",
  service: "nestjs-project-330",
  environment: "development",
});
import { RavynExceptionFilter } from './ravyn-exception.filter';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
