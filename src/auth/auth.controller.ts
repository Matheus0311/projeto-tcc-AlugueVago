import { Controller, Get, Post, Render, Request, UseGuards, Query } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('login.ejs') // Renderiza a página de login
  showLoginPage(@Query('error') error: string) { // Captura o parâmetro 'error' da URL
    return { error }; // Passa a variável 'error' para a renderização
  }

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  @Render('login.ejs')
  async login(@Request() req) {
    try {
      const user = await this.authService.validateUser(req.body.email, req.body.senha);
      console.log(user);
      if (user) {
        return { message: 'Login bem-sucedido', user };
      } else {
        return { error: 'Credenciais inválidas' };
      }
    } catch (error) {
      return { error: error.message || 'Erro durante o login' };
    }
  }
}
