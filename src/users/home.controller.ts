import { Controller, Get, Render, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller()
export class HomeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('home.html') // Renderiza a página 'home.html'
  async showHomePage(@Request() req): Promise<{ userIsLoggedIn: boolean, user: User }> {
    const userIsLoggedIn = req.isAuthenticated(); // Use a função de autenticação correta
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;

    return { userIsLoggedIn, user };
  }
}
