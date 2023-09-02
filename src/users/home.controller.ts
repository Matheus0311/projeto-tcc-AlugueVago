import { Controller, Get, Param, Render, Request, Res, Query, Post, Body  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ImovelService } from '../imoveis/imoveis.service';
import { Imovel } from 'src/imoveis/imovel.entity';
import { Response } from 'express';
import { ImovelFiltersDTO } from './filters.dto';





@Controller()
export class HomeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imovelService: ImovelService,
  ) {}

  // @Get()
  // @Render('home.html')
  // async showHomePage(@Request() req): Promise<{ userIsLoggedIn: boolean, user: User, imoveis: Imovel[] }> {
  //   const userIsLoggedIn = req.isAuthenticated();
  //   const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;

  
  //   // Fetch all properties from the ImovelService
  //   const imoveis = await this.imovelService.findAll();

  //   return { userIsLoggedIn, user, imoveis };
  // }

  // @Get(':page')
  // @Render('home.html')
  // async showHomePage(
  //   @Request() req,
  //   @Param('page') page: number = 1,
  //   @Query() filters: ImovelFiltersDTO,
  // ): Promise<{ userIsLoggedIn: boolean, user: User, imoveis: Imovel[], totalPages: number, currentPage: number }> {
  //   // Lógica para aplicar os filtros em sua consulta
  //   const imoveisFiltrados = await this.imovelService.filterImoveis(filters);

  //   // Restante do código para paginação e renderização
  //   const userIsLoggedIn = req.isAuthenticated();
  //   const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
  //   const itemsPerPage = 4;
  //   const { imoveis, total } = await this.imovelService.findAllWithPagination(page, itemsPerPage);
  //   const totalPages = Math.ceil(total / itemsPerPage);

  //   return { userIsLoggedIn, user, imoveis, totalPages, currentPage: page };
  // }


  @Get(':page')
@Render('home.html')
async showHomePage(
  @Request() req,
  @Param('page') page: number = 1,
  @Query() filters: ImovelFiltersDTO,
): Promise<{ userIsLoggedIn: boolean, user: User, imoveis: Imovel[], totalPages: number, currentPage: number }> {
  const { imoveis, total } = await this.imovelService.findAllWithPagination(page, 8, filters);

  const userIsLoggedIn = req.isAuthenticated();
  const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
  const totalPages = Math.ceil(total / 8); // 4 é o número de itens por página

  return { userIsLoggedIn, user, imoveis, totalPages, currentPage: page };
}

@Post('filter-imoveis')
async filterImoveis(
  @Request() req,
  @Body() filters: ImovelFiltersDTO,
): Promise<{ userIsLoggedIn: boolean; user: User; imoveis: Imovel[]; totalPages: number; currentPage: number; totalImoveis: number }> {
  const imoveis = await this.imovelService.filterImoveis(filters);
  const userIsLoggedIn = req.isAuthenticated();
  const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
  const totalPages = Math.ceil(imoveis.length / 4);

  return { userIsLoggedIn, user, imoveis, totalPages, currentPage: 1, totalImoveis: imoveis.length };
}



@Get()
redirectToHomePage(@Res() res: Response) {
  return res.redirect('/1');
}


  @Get('/uploads/fotos-imoveis/:imageName')
  async serveRotaImovelImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = `./uploads/fotos-imoveis/${imageName}`;
    res.sendFile(imagePath, { root: '.' });
  }
}
