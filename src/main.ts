import { init } from '@ravyn-team/node';

init({
  dsn: "https://56c6367e36a64d90e035449ba2e75ff0@ingest.ravyn-team.me/ingest/telemetry",
  service: "ecommerce-nest",
  environment: "development"
});


import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import { RavynExceptionFilter } from './ravyn-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static HTML/CSS/JS frontend
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Attach your custom Ravyn filter!
  app.useGlobalFilters(new RavynExceptionFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NestJS E-Commerce running on port ${port}`);
}
bootstrap();
