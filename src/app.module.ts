// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { Endereco } from './enderecos/endereco.entity';
import { EnderecoController } from './enderecos/enderecos.controller';
import { EnderecoService } from './enderecos/enderecos.service';
import { Estado } from './estados/estado.entity';
import { Imovel } from './imoveis/imovel.entity';
import { ImovelController } from './imoveis/imoveis.controller';
import { ImovelService } from './imoveis/imoveis.service';
import { EstadoController } from './estados/estados.controller';
import { EstadoService } from './estados/estados.service';
import { Avaliacao } from './avaliacoes/avaliacao.entity';
import { AvaliacaoController } from './avaliacoes/avaliacoes.controller';
import { AvaliacaoService } from './avaliacoes/avaliacoes.service';


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
    TypeOrmModule.forFeature([User, Estado, Endereco, Imovel, Avaliacao]),
    
  ],
  controllers: [UsersController, EstadoController, EnderecoController, ImovelController, AvaliacaoController, ],
  providers: [UsersService, EstadoService, EnderecoService, ImovelService, AvaliacaoService],
})
export class AppModule {}









/* 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';

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
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      dest: path.join(__dirname, '..', 'uploads/perfil'), // Caminho absoluto para o diretório de destino
      limits: {
        fileSize: 3 * 1024 * 1024, // Limite de 3MB
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
 */