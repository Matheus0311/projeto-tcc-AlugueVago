import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importe NestExpressApplication
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthExceptionFilter } from './auth/auth-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Especifique o tipo de aplicação

  app.useGlobalFilters(new AuthExceptionFilter());

  // Configure o módulo ServeStatic para servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'perfil'));
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'fotos-imoveis'));



  // Configurar o mecanismo de visualização para 'html'
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('html', require('ejs').renderFile);
  app.setViewEngine('html');

  app.use(session({
    secret: 'Muito seguro',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
