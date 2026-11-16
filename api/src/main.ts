import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { static as serveStatic } from 'express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const prismaService = app.get(PrismaService);

  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use('/uploads', serveStatic(configService.get<string>('UPLOADS_ROOT') ?? resolve(process.cwd(), '..', 'apps', 'web', 'public', 'uploads'), { fallthrough: false, index: false }));

  const frontendOrigin = configService.get<string>('FRONTEND_URL');
  if (!frontendOrigin) {
    throw new Error('FRONTEND_URL is not configured');
  }

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    exposedHeaders: ['x-request-id'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  prismaService.enableShutdownHooks(app);

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
void bootstrap();
