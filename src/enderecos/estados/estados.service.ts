// enderecos/estados/estados.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly userRepository: Repository<Estado>,
  ) {}

  async findAll(): Promise<Estado[]> {
    return this.userRepository.find();
  }

  async create(estado: Estado): Promise<Estado> {
    if (!estado.nomeEstado) {
      throw new BadRequestException('O nome do estado deve ser fornecido.');
    }
    return this.userRepository.save(estado);
  }
  

  async update(id: number, estado: Estado): Promise<Estado> {
    await this.userRepository.update(id, estado);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

