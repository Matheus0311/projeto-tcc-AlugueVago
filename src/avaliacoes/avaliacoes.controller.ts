import { Controller, Post, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { AvaliacaoService } from './avaliacoes.service';
import { Avaliacao } from './avaliacao.entity';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Get()
  async findAll(): Promise<Avaliacao[]> {
    return this.avaliacaoService.findAllAvaliacoes();
  }

  @Post()
  async create(@Body() body: { avaliacao: Avaliacao; userId: number; imovelId: number }): Promise<Avaliacao> {
    const { avaliacao, userId, imovelId } = body;
    return this.avaliacaoService.createAvaliacao(avaliacao, userId, imovelId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() avaliacao: Avaliacao): Promise<Avaliacao> {
    return this.avaliacaoService.updateAvaliacao(id, avaliacao);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.avaliacaoService.deleteAvaliacao(id);
  }
}
