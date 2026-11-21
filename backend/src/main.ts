import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });
  // Render (and most hosts) sit behind a proxy. Trusting the first hop makes the rate limiter see
  // each visitor's real IP instead of the proxy's, so one busy visitor cannot block everyone.
  app.set('trust proxy', 1);

  // Allow the frontend origin(s) to call the API. Comma-separated list in CORS_ORIGIN.
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(','),
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
