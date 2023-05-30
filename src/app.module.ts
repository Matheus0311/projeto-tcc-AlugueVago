// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { EstadosController } from './enderecos/estados/estados.controller';
import { EstadosService } from './enderecos/estados/estados.service';
import { Estado } from './enderecos/estados/estado.entity';
import { CidadesController } from './enderecos/cidades/cidades.controller';
import { CidadesService } from './enderecos/cidades/cidades.service';
import { Cidade } from './enderecos/cidades/cidade.entity';
import { EnderecosController } from './enderecos/enderecos/enderecos.controller';
import { EnderecosService } from './enderecos/enderecos/enderecos.service';
import { Endereco } from './enderecos/enderecos/endereco.entity';

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
    TypeOrmModule.forFeature([User, Estado, Cidade, Endereco]),
    MulterModule.register({
      dest: path.join(__dirname, '..', 'uploads/perfil'), // Caminho absoluto para o diretório de destino
      limits: {
        fileSize: 3 * 1024 * 1024, // Limite de 3MB
      },
    }),
  ],
  controllers: [UsersController, EstadosController, CidadesController, EnderecosController],
  providers: [UsersService, EstadosService, CidadesService, EnderecosService],
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