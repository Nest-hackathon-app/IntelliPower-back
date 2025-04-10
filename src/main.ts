/* eslint-disable @typescript-eslint/no-misused-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RoleGuard } from './auth/guards/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    logger: ['error', 'warn', 'log'],
  });
  const config = new DocumentBuilder().setTitle('BACKEND API DOCS').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use(
    '/api-docs',
    apiReference({
      theme: 'solarized',
      content: documentFactory,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT, // or Transport.REDIS, Transport.KAFKA, etc.
    options: {
      host: 'localhost',
      port: 1883,
    },
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableShutdownHooks();
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await app.close();
    process.exit(0);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`Server started on port ${process.env.PORT ?? 3000}`);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
