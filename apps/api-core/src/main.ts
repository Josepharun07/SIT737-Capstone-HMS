import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so the React Admin Panel can communicate with this API
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Start on port 4000 as defined in our Dockerfile
  await app.listen(process.env.API_PORT || 4000);
  console.log(`Blueberry API is running on port: ${process.env.API_PORT || 4000}`);
}
bootstrap();