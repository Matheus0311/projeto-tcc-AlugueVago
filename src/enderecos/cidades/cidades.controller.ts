// cidades/cidades.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CidadesService } from './cidades.service';
import { Cidade } from './cidade.entity';

@Controller('cidades')
export class CidadesController {
  constructor(private readonly cidadesService: CidadesService) {}

  @Get()
  async findAll(): Promise<Cidade[]> {
    return this.cidadesService.findAll();
  }

  @Post()
  async create(@Body() cidade: Cidade): Promise<Cidade> {
    return this.cidadesService.create(cidade);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() cidade: Cidade): Promise<Cidade> {
    return this.cidadesService.update(Number(id), cidade);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cidadesService.delete(Number(id));
  }
}
