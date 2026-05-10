import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));

  const origin = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173').split(',').map(s => s.trim());
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });

  const swagger = new DocumentBuilder()
    .setTitle('San José Tatacoa API')
    .setDescription('Portal de Reservas – San José Tatacoa Finca Hotel Turística')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  

  const port = parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 API corriendo en http://localhost:${port}/api`);
  logger.log(`📖 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();