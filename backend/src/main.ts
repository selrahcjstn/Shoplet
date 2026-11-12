import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(
    new DatabaseExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const config = new DocumentBuilder()
    .setTitle('Shoplet API')
    .setDescription('Shoplet mini online storefront platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    () => SwaggerModule.createDocument(app, config),
    {
      jsonDocumentUrl: 'api/docs-json',
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
