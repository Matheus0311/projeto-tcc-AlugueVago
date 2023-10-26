import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { AvaliacaoService } from './avaliacoes.service';
import { Avaliacao } from './avaliacao.entity';
import { AverageRating } from '../imoveis/imoveis.controller';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  async findAll(): Promise<Avaliacao[]> {
    return this.avaliacaoService.findAllAvaliacoes();
  }
  @Get('imovel/:imovelId') // Adicione esta rota
  @UsePipes(new ValidationPipe())
  async getAvaliacoesByImovelId(@Param('imovelId') imovelId: number): Promise<AverageRating> {
    return this.avaliacaoService.getAverageRating(imovelId);
  }

  @Get('user-rating')
@UsePipes(new ValidationPipe())
async getUserRating(@Query('imovelId') imovelId: number, @Query('userId') userId: number): Promise<Avaliacao | null> {
  return this.avaliacaoService.getUserRating(imovelId, userId);
}

@Get('average-rating')
@UsePipes(new ValidationPipe())
async getAverageRating(@Query('imovelId') imovelId: number): Promise<AverageRating> {
  return this.avaliacaoService.getAverageRating(imovelId);
}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: { avaliacao: Avaliacao; userId: number; imovelId: number }): Promise<Avaliacao> {
    const { avaliacao, userId, imovelId } = body;
    return this.avaliacaoService.createOrUpdateAvaliacao(avaliacao, userId, imovelId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: number, @Body() avaliacao: Avaliacao): Promise<Avaliacao> {
    return this.avaliacaoService.updateAvaliacao(id, avaliacao);
  } 

  // @Delete(':id')
  // @UsePipes(new ValidationPipe())
  // async delete(@Param('id') id: number): Promise<void> {
  //   return this.avaliacaoService.deleteAvaliacao(id);
  // }

  @Delete('remover-avaliacao/:imovelId/:userId')
  @UsePipes(new ValidationPipe())
  async removeReview(
    @Param('imovelId') imovelId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    await this.avaliacaoService.deleteAvaliacaoByImovelAndUser(imovelId, userId);
  }
  

}