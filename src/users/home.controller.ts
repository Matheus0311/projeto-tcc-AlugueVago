import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HomeController {
  @Get()
  renderHomePage(@Res() res: Response) {
    return res.render('home.html'); // Renderizar a página home.html
  }
}
