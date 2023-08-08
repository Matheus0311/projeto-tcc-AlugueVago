import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  Render,
  Res,
  UseGuards,
  Request,
  Logger,
  Patch,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { diskStorage } from 'multer';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

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
      res.redirect('/users/login');
      return createdUser;
    } catch (error) {
      const errorMessages = error instanceof Array ? error : [error.message];
      return res.render('cadastro.html', { errorMessages });
  }

    //return this.usersService.create(user);
  }

  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // async update(@Param('id') id: string, @Body() user: User): Promise<User> {
  //   return this.usersService.update(Number(id), user);
  // }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(Number(id));
  }

  @Get('cadastro')
  @Render('cadastro.html') // Renderiza a página 'cadastro.html'
  showCadastroPage() {
    return {};
  }


  @Get('/edit')
  @Render('edit-user.html')
  async showEditUserPage(@Request() req): Promise<{ user: User }> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return { user: user };
  }


  @Post('/edit/:id')
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
  async update(
    @Param('id') id: string,
    @UploadedFile() file,
    @Res() res,
    @Req() req
  ): Promise<void> {
    console.log('Dados recebidos do formulário:', req.body);
    const userId = parseInt(id);
  
    const user = await this.usersService.findById(userId);
    if (!user) {
      const errorMessages = ['Usuário não encontrado.'];
      console.log('Usuário não encontrado.');
      return res.render('edit-user.html', { user, errorMessages });
    }
  
    // Atualiza os campos do usuário com os dados do formulário
    user.nomeUsuario = req.body.nomeUsuario || user.nomeUsuario;
    user.emailUsuario = req.body.emailUsuario || user.emailUsuario;
    user.senhaUsuario = req.body.senhaUsuario.hashedPassword || user.senhaUsuario;
    user.rendaMensalUsuario = req.body.rendaMensalUsuario || user.rendaMensalUsuario;
    user.rgUsuario = req.body.rgUsuario || user.rgUsuario;
    user.cpfUsuario = req.body.cpfUsuario || user.cpfUsuario;
  
    if (file) {
      const imagePath = `uploads/perfil/${file.filename}`;
      user.imagemPerfil = imagePath;
    }
  
    // Atualiza o usuário no banco de dados
    const updated = await this.usersService.update(userId, user);
  
    if(updated){
      // Redireciona para a página de edição novamente
      res.redirect('/users/edit');
      console.log('Depois da atualização:', user);
      console.log('Dados do usuário atualizados com sucesso.');
    }
  }
  
  @Get('login')
  @Render('login.html') // Renderiza a página 'cadastro.html'
  showLogin() {
    return {};
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() res) {
    try {
      const user = await (req.body.email, req.body.senha);

      if (user) {
        res.redirect('/');
      } else {
        return { message: 'Credenciais inválidas', user };
      }
    } catch (error) {
      return { message: 'Erro durante o login' };
    }
  }
  // login(@Request() req): any {
  //   console.log("entrou");
  //   return { User: req.user, msg: 'User loggin in' }
  // }

  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req,  @Res() res): any {
    req.session.destroy();
    console.log("saiu");
    res.redirect('/');
    //return { msg: 'The user session has ended' }
  }

  @Get('/delete-account')
  @Render('delete-account.html')
  async showDeleteAccountPage(@Request() req): Promise<{ user: User, deleteCode: string }> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
  
    // Gere um código aleatório (pode ser um número aleatório de 6 dígitos, por exemplo)
    const deleteCode = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.deleteCode = deleteCode;
  
    return { user: user, deleteCode: deleteCode };
  }
  
  @Post('/delete-account')
  async deleteAccount(
    @Body() formData: { email: string, senha: string, deleteCode: string },
    @Request() req,
    @Res() res
  ): Promise<void> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
  
    if (!user) {
      const errorMessages = ['Usuário não encontrado.'];
      return res.render('delete-account.html');
    }
  
    // Verifique se o email e a senha estão corretos
    const passwordsMatch = await this.usersService.comparePasswords(formData.senha, user.senhaUsuario);
    if (!passwordsMatch || formData.email !== user.emailUsuario) {
      const errorMessages = ['Credenciais incorretas.'];
      return res.render('delete-account.html');
    }
  
    // Verifique se o código de exclusão está correto
    if (formData.deleteCode !== req.session.deleteCode) {
      const errorMessages = ['Código de exclusão incorreto.'];
      return res.render('delete-account.html');
    }
  
    // Se tudo estiver correto, exclua a conta e redirecione para a página de login
    await this.usersService.delete(userId);
    req.session.destroy();
    res.redirect('/users/login');
  }

  @Get('/uploads/perfil/:imageName')
  async serveProfileImage(@Param('imageName') imageName, @Res() res) {
    // Construa o caminho completo da imagem a partir do nome recebido
    const imagePath = `./uploads/perfil/${imageName}`;
    // Envie o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }

}
