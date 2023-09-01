import { Controller, Get, Param, Render, Request, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ImovelService } from '../imoveis/imoveis.service';
import { Imovel } from 'src/imoveis/imovel.entity';

@Controller()
export class HomeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imovelService: ImovelService,
  ) {}

  @Get()
  @Render('home.html')
  async showHomePage(@Request() req): Promise<{ userIsLoggedIn: boolean, user: User, imoveis: Imovel[] }> {
    const userIsLoggedIn = req.isAuthenticated();
    const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;

  
    // Fetch all properties from the ImovelService
    const imoveis = await this.imovelService.findAll();

    return { userIsLoggedIn, user, imoveis };
  }

  @Get('/uploads/fotos-imoveis/:imageName')
  async serveRotaImovelImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = `./uploads/fotos-imoveis/${imageName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }
}
