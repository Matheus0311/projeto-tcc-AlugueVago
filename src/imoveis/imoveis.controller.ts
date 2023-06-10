import { Controller, Post, Body, Get, Param, Put, Delete, InternalServerErrorException } from '@nestjs/common';
import { ImovelService } from './imoveis.service';
import { Imovel } from './imovel.entity';
import { Endereco } from '../enderecos/endereco.entity';

@Controller('imoveis')
export class ImovelController {
  constructor(private readonly imovelService: ImovelService) {}

  @Post()
  async create(@Body() body: { imovel: Imovel; endereco: Endereco }): Promise<Imovel> {
    const { imovel, endereco } = body;
    try {
      imovel.endereco = endereco; // Associa o endereço ao imóvel
      return await this.imovelService.createImovelWithEndereco(imovel, endereco);
    } catch (error) {
      console.error('Erro ao criar o imóvel:', error);
      throw new InternalServerErrorException('Erro ao criar o imóvel');
    }
  }

  @Get()
  async findAll(): Promise<Imovel[]> {
    return this.imovelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Imovel> {
    return this.imovelService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() imovel: Imovel): Promise<Imovel> {
    return this.imovelService.update(id, imovel);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.imovelService.delete(id);
  }
}