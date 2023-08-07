import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('auth')
export class ProfileController {
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Verifica se o usuário está autenticado
    if (req.isAuthenticated()) {
      return { message: 'Usuário autenticado', user: req.user };
    } else {
      return { message: 'Usuário não autenticado' };
    }
  }
}

