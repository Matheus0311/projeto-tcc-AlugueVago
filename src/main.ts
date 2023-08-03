import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importe NestExpressApplication
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Especifique o tipo de aplicação

  app.useGlobalPipes(new ValidationPipe());

  // Configure o módulo ServeStatic para servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configurar o mecanismo de visualização para 'html'
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('html', require('ejs').renderFile);
  app.setViewEngine('html');

  await app.listen(3000);
}
bootstrap();
