import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
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


  /* @Post()
  @UseInterceptors(FileInterceptor('imagemPerfil', {
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new BadRequestException('O arquivo enviado não é uma imagem válida.'), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/perfil',
      filename: (req, file, cb) => {
        const fileExt = extname(file.originalname); // Obter a extensão do arquivo
        const fileName = `perfil_${Date.now()}${fileExt}`; // Gerar o nome do arquivo com a extensão
        cb(null, fileName);
      },
    }),
  }))
  async create(@Body() user: User, @UploadedFile() file): Promise<User> {
    if (file) {
      user.imagemPerfil = file.filename;
    }
    return this.usersService.create(user);
  } */
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(Number(id));
  }
}
