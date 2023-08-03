import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UsePipes, ValidationPipe, Render, Req, Res } from '@nestjs/common';
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
  async create(@Body() user: User, @UploadedFile() file, @Res() res): Promise<User> {
    if (file) {
      const imagePath = `uploads/perfil/${file.filename}`;
      user.imagemPerfil = imagePath;
    }

    try {
      const createdUser = await this.usersService.create(user);
      // Redirect to a success page or display a success message if needed
      res.redirect('/users');
      return createdUser;
    } catch (error) {
      const errorMessages = error instanceof Array ? error : [error.message];
      return res.render('cadastro.html', { errorMessages });
  }

    //return this.usersService.create(user);
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

  @Get('cadastro')
  @Render('cadastro.html') // Renderiza a página 'cadastro.html'
  showCadastroPage() {
    return {};
  }
}
