import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security middleware
  app.use(helmet.default());
  app.use(compression());
  
  // Rate limiting
  app.use(new RateLimitMiddleware({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  }).use);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
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

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 3030;
  await app.listen(port);

  console.log(`🚀 Space Debris API is running on: http://localhost:${port}/api/v1`);
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔍 Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
