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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { diskStorage } from 'multer';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthenticatedGuard, AdminGuard)
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
      res.redirect('/users/login');
      return createdUser;
    } catch (error) {
      const errorMessages = error instanceof Array ? error : [error.message];
      return res.render('cadastro.html', { errorMessages });
  }

  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, AdminGuard)
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
  async showEditUserPage(@Request() req, @Res() res): Promise<{ user: User, userIsLoggedIn: boolean }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    if(!user){res.redirect('/');}
    return { user: user, userIsLoggedIn };
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
      console.log('Usuário não encontrado.');
      res.redirect('/');
    }
    
  
    // Atualiza os campos do usuário com os dados do formulário
    user.nomeUsuario = req.body.nomeUsuario || user.nomeUsuario;
    user.emailUsuario = req.body.emailUsuario || user.emailUsuario;
    user.senhaUsuario = req.body.senhaUsuario || user.senhaUsuario;
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
      res.redirect('/users/account-config');
      console.log('Depois da atualização:', user);
      console.log('Dados do usuário atualizados com sucesso.');
    }
  }
  
  @Get('login')
  @Render('login.ejs')
  loginPage(@Query('error') error: string) {
    return { error };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @Render('login.ejs')
  async login(@Request() req, @Res() res, @Query('error') error: string) {
    try {
      // O LocalAuthGuard já fez a validação e autenticação
      // Se chegou aqui, o usuário é válido
      console.log(req.user)
      if (req.user === false) {
        console.log(req.user)
        // Autenticação falhou, redirecionar para a página de login com mensagem de erro
        return { error: 'Usuário ou senha incorretos. Tente novamente.' };
      }
      
      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Ocorreu um erro durante o login. Tente novamente.' };
    }
  }
  
  
  

  @Get('/protected')
  @UseGuards(AuthenticatedGuard, AdminGuard)
  getHello(@Request() req): string {
    return req.user;
  }

  @Get('/logout')
  async logout(@Request() req,  @Res() res): Promise<{ userIsLoggedIn: boolean }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    if(!user){res.redirect('/');}
    else{
      req.session.destroy();
      console.log("saiu");
      res.redirect('/');
    }

    return {userIsLoggedIn}
  }

  @Get('/delete-account')
  @Render('delete-account.html')
  async showDeleteAccountPage(@Request() req, @Res() res): Promise<{ user: User, deleteCode: string, userIsLoggedIn: boolean }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    if(!user){res.redirect('/');}
  
    // Gera um código aleatório (pode ser um número aleatório de 6 dígitos, por exemplo)
    const deleteCode = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.deleteCode = deleteCode;
  
    return { user: user, deleteCode: deleteCode, userIsLoggedIn };
  }
  
  @Post('/delete-account')
  @UseGuards(AuthenticatedGuard)
  async deleteAccount(
    @Body() formData: { email: string, senha: string, deleteCode: string },
    @Request() req,
    @Res() res
  ): Promise<void> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
  
    if(!user){res.redirect('/users/delete-account');}
  
    // Verifique se o email e a senha estão corretos
    const passwordsMatch = await this.usersService.comparePasswords(formData.senha, user.senhaUsuario);
    if (!passwordsMatch || formData.email !== user.emailUsuario) {
      return res.render('delete-account.html');
    }
  
    // Verifique se o código de exclusão está correto
    if (formData.deleteCode !== req.session.deleteCode) {
      return res.render('delete-account.html');
    }
  
    // Se tudo estiver correto, exclui a conta e redireciona para a página de login
    await this.usersService.delete(userId);
    req.session.destroy();
    res.redirect('/users/login');
  }

  @Get('/uploads/perfil/:imageName')
  async serveProfileImage(@Param('imageName') imageName, @Res() res) {
    // Constroi o caminho completo da imagem a partir do nome recebido
    const imagePath = `./uploads/perfil/${imageName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }

  @Get('/account-config')
  @Render('account-config.html') // Renderiza a página 'account-config.html'
  async showAccountConfig(@Request() req, @Res() res): Promise<{ userIsLoggedIn: boolean, user: User }> {
    const userIsLoggedIn = req.isAuthenticated(); 
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
    if(!user){res.redirect('/');}

    return { userIsLoggedIn, user };
  }

}
