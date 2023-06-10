import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { EstadoService } from './estados.service';
import { Estado } from './estado.entity';

@Controller('estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  async findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() estado: Estado): Promise<Estado> {
    return this.estadoService.create(estado);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Estado> {
    return this.estadoService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: number, @Body() estado: Estado): Promise<Estado> {
    return this.estadoService.update(id, estado);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.estadoService.delete(id);
  }
}
