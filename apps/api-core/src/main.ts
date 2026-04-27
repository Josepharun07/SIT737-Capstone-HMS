import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CustomLoggerService } from './common/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use custom logger
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  logger.log('🚀 Starting Blueberry HMS API...', 'Bootstrap');

  app.use(helmet.default());
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://blueberryhillsmunnar.in', 'https://hms.blueberryhillsmunnar.in']
      : '*',
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Blueberry HMS API')
    .setDescription('Hotel Management Suite for Blueberry Hills Resort, Munnar')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Property Management')
    .addTag('User Management')
    .addTag('Audit Logs')
    .addTag('Bookings')
    .addTag('Rooms')
    .addTag('Guests')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  
  logger.log(`✅ API running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 Docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
  logger.log(`🏨 Property: Blueberry Hills Resort, Munnar`, 'Bootstrap');
  logger.log(`📝 Logging: Active (logs directory)`, 'Bootstrap');
}

bootstrap();
