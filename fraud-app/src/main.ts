import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://api.skillsolving.ai',
      'https://skillsolving.com',
      'http://quokka-frontend1.s3-website-us-east-1.amazonaws.com',
      'https://d3jbxkf10fm5wb.cloudfront.net',
      'https://www.skillsolving.com',
      'https://www.api.skillsolving.ai',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
