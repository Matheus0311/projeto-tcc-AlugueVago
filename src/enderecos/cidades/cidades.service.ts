// cidades/cidades.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from './cidade.entity';

@Injectable()
export class CidadesService {
  constructor(
    @InjectRepository(Cidade)
    private readonly cidadeRepository: Repository<Cidade>,
  ) {}

  async findAll(): Promise<Cidade[]> {
    return this.cidadeRepository.find();
  }

  async create(cidade: Cidade): Promise<Cidade> {
    return this.cidadeRepository.save(cidade);
  }

  async update(id: number, cidade: Cidade): Promise<Cidade> {
    await this.cidadeRepository.update(id, cidade);
    return this.cidadeRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.cidadeRepository.delete(id);
  }
}
