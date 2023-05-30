// enderecos/estados/estados.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';

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

