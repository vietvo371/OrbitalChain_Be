import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Space Debris Management API')
    .setDescription(`
      A comprehensive API for managing space debris observations, user interactions, and blockchain logging.
      
      ## Features
      - **User Management**: Registration, authentication, role-based access control
      - **Debris Tracking**: Space debris catalog management with risk assessment
      - **Observations**: User-submitted debris observations with image uploads
      - **Moderation**: Content moderation system for observations
      - **Blockchain Integration**: Transaction logging and verification
      - **Analytics**: Comprehensive statistics and reporting
      - **Search**: Advanced search and filtering capabilities
      - **Media**: Image upload and management
      
      ## Authentication
      This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
      \`Authorization: Bearer <your-token>\`
      
      ## Rate Limiting
      API requests are rate limited to prevent abuse. Default limits:
      - 100 requests per minute for authenticated users
      - 20 requests per minute for unauthenticated requests
      
      ## Error Handling
      All errors follow a consistent format:
      \`\`\`json
      {
        "statusCode": 400,
        "message": "Error description",
        "error": "Error type",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "path": "/api/v1/endpoint"
      }
      \`\`\`
    `)
    .setVersion('1.0.0')
    .setContact(
      'Space Debris Team',
      'https://github.com/your-org/space-debris-api',
      'contact@spacedebris.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3030/api/v1', 'Development Server')
    .addServer('https://api.spacedebris.com/v1', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Debris', 'Space debris catalog and tracking')
    .addTag('Observations', 'User observations and submissions')
    .addTag('Moderations', 'Content moderation system')
    .addTag('Blockchain Logs', 'Blockchain transaction logging')
    .addTag('Analytics', 'Statistics and reporting')
    .addTag('Search', 'Search and filtering')
    .addTag('Media', 'File upload and media management')
    .addTag('Health', 'Health checks and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Space Debris API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 4px; }
    `,
  });

  return document;
}
