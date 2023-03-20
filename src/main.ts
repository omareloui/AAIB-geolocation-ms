import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomWinstonLogger } from './helpers/logger.service';
import * as correlationId from 'express-correlation-id';
import { HttpExceptionFilter } from './middlewares/errorHandling-middleware';
import { ConfigService } from '@nestjs/config';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerInstance = app.get(CustomWinstonLogger);
  const config = app.get(ConfigService);

  const docsConfig = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  app.useLogger(loggerInstance);
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));
  app.use(correlationId());

  await app.listen(config.get('server.port') || 3000);
}
bootstrap();
