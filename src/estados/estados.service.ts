import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find();
  }

  async create(estado: Estado): Promise<Estado> {
    return this.estadoRepository.save(estado);
  }

  async findOne(id: number): Promise<Estado> {
    return this.estadoRepository.findOne({ where: { id } });
  }

  async update(id: number, estado: Estado): Promise<Estado> {
    await this.estadoRepository.update(id, estado);
    return this.estadoRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.estadoRepository.delete(id);
  }
}
