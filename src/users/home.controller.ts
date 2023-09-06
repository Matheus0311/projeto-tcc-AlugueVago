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
  const totalPages = Math.ceil(total / 8);

  return { userIsLoggedIn, user, imoveis, totalPages, currentPage: page };
}

// @Post('filter-imoveis')
// async filterImoveis(
//   @Request() req,
//   @Body() filters: ImovelFiltersDTO,
// ): Promise<{ userIsLoggedIn: boolean; user: User; imoveis: Imovel[]; totalPages: number; currentPage: number; totalImoveis: number }> {
//   const imoveis = await this.imovelService.filterImoveis(filters);
//   const userIsLoggedIn = req.isAuthenticated();
//   const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
//   const totalPages = Math.ceil(imoveis.length / 8);

//   return { userIsLoggedIn, user, imoveis, totalPages, currentPage: 1, totalImoveis: imoveis.length };
// }


@Post('filter-imoveis')
async filterImoveis(
  @Request() req,
  @Body() filters: ImovelFiltersDTO,
): Promise<{ userIsLoggedIn: boolean; user: User; imoveis: Imovel[]; totalPages: number; currentPage: number; totalImoveis: number }> {
  const itemsPerPage = 8;
  const currentPage = filters.page ? parseInt(filters.page.toString()) : 1;
  const filteredImoveis = await this.imovelService.filterImoveis(filters);

  const userIsLoggedIn = req.isAuthenticated();
  const user = userIsLoggedIn ? await this.usersService.findById(req.user.id) : null;
  const totalImoveis = await this.imovelService.countFilteredImoveis(filters);
  const totalPages = Math.ceil(totalImoveis / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imoveis = filteredImoveis.slice(startIndex, endIndex);

  return { userIsLoggedIn, user, imoveis, totalPages, currentPage, totalImoveis };
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
