import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
//import * as express from 'express';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config'
import express, { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FITMANAGER - PROYECTO FINAL - BACKEND')
    .setDescription('DOCUMENTACIÓN DE LA API DE FITMANAGER')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' },
    customSiteTitle: 'PF - FITMANAGER',
  });

  app.use(loggerGlobal);

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //app.use(auth(auth0Config));
  // Aquí debes incluir las variables de entorno para Auth0

  // Habilitar middleware para procesar JSON
  app.useGlobalPipes(new ValidationPipe())

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
