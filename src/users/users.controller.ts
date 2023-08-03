/* import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { diskStorage } from 'multer';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  @Post()
  @UseInterceptors(FileInterceptor('imagemPerfil', {
    storage: diskStorage({
      destination: './uploads', // Diretório de destino para salvar a imagem
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = file.originalname.split('.').pop(); // Obter a extensão do arquivo
        const filename = `${uniqueSuffix}.${fileExtension}`; // Nome do arquivo com base em um valor único
        cb(null, filename);
      },
    }),
  }))
  async create(@Body() user: User, @UploadedFile() file): Promise<User> {
    if (file) {
      const imagePath = `uploads/perfil/${file.filename}`;
      user.imagemPerfil = imagePath;
    }
  
    return this.usersService.create(user);
  }
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(Number(id));
  }
} */


import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UsePipes, ValidationPipe, Render } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('imagemPerfil', {
      storage: diskStorage({
        destination: './uploads/perfil', // Diretório de destino para salvar a imagem na pasta "perfil"
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExtension = file.originalname.split('.').pop(); // Obter a extensão do arquivo
          const filename = `${uniqueSuffix}.${fileExtension}`; // Nome do arquivo com base em um valor único
          cb(null, filename);
        },
      }),
    }),
  )
  async create(@Body() user: User, @UploadedFile() file): Promise<User> {
    if (file) {
      const imagePath = `uploads/perfil/${file.filename}`;
      user.imagemPerfil = imagePath;
    }

    return this.usersService.create(user);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(Number(id));
  }

  @Get('cadastro') // Rota para exibir a página de cadastro
  @Render('cadastro') // Nome da visualização (sem a extensão)
  showCadastroPage() {
    return {};
  }
}
