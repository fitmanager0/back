import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerGlobal } from './middlewares/logger.middleware';

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
    origin: [
      'http://localhost:3001',
      'https://fitmanager-git-develop-fitmanager0s-projects.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
