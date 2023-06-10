/* import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { Endereco } from './endereco.entity';

@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Get()
  async findAll(): Promise<Endereco[]> {
    return this.enderecosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Endereco> {
    return this.enderecosService.findOne(Number(id));
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
  async remove(@Param('id') id: string): Promise<void> {
    return this.enderecosService.remove(Number(id));
  }
} */

import { Controller, Post, Body, Get, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { EnderecoService } from './enderecos.service';
import { Endereco } from './endereco.entity';

@Controller('enderecos')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() endereco: Endereco): Promise<Endereco> {
    return this.enderecoService.create(endereco);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Endereco> {
    return this.enderecoService.findOne(id);
  }

  @Get()
  async findAll(): Promise<Endereco[]> {
    return this.enderecoService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: number, @Body() endereco: Endereco): Promise<Endereco> {
    return this.enderecoService.update(id, endereco);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.enderecoService.delete(id);
  }
}

