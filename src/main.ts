/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set the global prefix  
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors();

  // Use global validation pipe
  // Add this before Swagger setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true, //TODO this or whitelist : true ?
    })
  );
  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Auction App API")
    .setDescription("API for managing auctions, bids, and products")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Start the server
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}...`);
}

bootstrap();
