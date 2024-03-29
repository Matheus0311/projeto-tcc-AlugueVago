import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { Imovel } from './imoveis/imovel.entity';
import { ImovelController } from './imoveis/imoveis.controller';
import { ImovelService } from './imoveis/imoveis.service';
import { Avaliacao } from './avaliacoes/avaliacao.entity';
import { AvaliacaoController } from './avaliacoes/avaliacoes.controller';
import { AvaliacaoService } from './avaliacoes/avaliacoes.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HomeController } from './users/home.controller';
import { PhotosModule } from './photos/photos.module';
import { PhotosService } from './photos/photos.service';
import { Photo } from './photos/photo.entity';
import { PhotoController } from './photos/photos.controller';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Imovel, Avaliacao, Photo]),
    AuthModule, UsersModule, PhotosModule,
  ],
  controllers: [UsersController, ImovelController, AvaliacaoController, HomeController, PhotoController],
  providers: [UsersService, ImovelService, AvaliacaoService, PhotosService],
})
export class AppModule {}
