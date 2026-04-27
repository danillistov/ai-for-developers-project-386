import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const message = errors
          .map((e) => Object.values(e.constraints ?? {}).join('; '))
          .join(' | ');
        return new BadRequestException({ code: 'validation_failed', message });
      },
    }),
  );

  const port = process.env.PORT ?? 4010;
  await app.listen(port);
  console.log(`Backend listening on port ${port}`);
}

bootstrap();
