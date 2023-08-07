import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const user = await this.authService.validateUser(req.body.email, req.body.senha);
      if (user) {
        return { message: 'Login bem-sucedido', user };
      } else {
        return { message: 'Credenciais inválidas' };
      }
    } catch (error) {
      return { message: 'Erro durante o login' };
    }
  }
}
