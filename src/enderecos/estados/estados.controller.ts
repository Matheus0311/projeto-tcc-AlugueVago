// estados.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { Estado } from './estado.entity';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Get()
  async findAll(): Promise<Estado[]> {
    return this.estadosService.findAll();
  }

  @Post()
  async create(@Body() estado: Estado): Promise<Estado> {
    return this.estadosService.create(estado);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() estado: Estado): Promise<Estado> {
    return this.estadosService.update(Number(id), estado);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.estadosService.delete(Number(id));
  }
}
