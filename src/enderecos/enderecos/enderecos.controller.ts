// enderecos/enderecos.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { Endereco } from './endereco.entity';

@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Get()
  async findAll(): Promise<Endereco[]> {
    return this.enderecosService.findAll();
  }

  @Post()
  async create(@Body() endereco: Endereco): Promise<Endereco> {
    return this.enderecosService.create(endereco);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() endereco: Endereco): Promise<Endereco> {
    return this.enderecosService.update(Number(id), endereco);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.enderecosService.delete(Number(id));
  }
}
