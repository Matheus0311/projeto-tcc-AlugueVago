import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco } from './endereco.entity';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
  ) {}

  async create(endereco: Endereco): Promise<Endereco> {
    return this.enderecoRepository.save(endereco);
  }

  async findOne(id: number): Promise<Endereco> {
    return this.enderecoRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Endereco[]> {
    return this.enderecoRepository.find({ relations: ['estado'] });
  }

  async update(id: number, endereco: Endereco): Promise<Endereco> {
    await this.enderecoRepository.update(id, endereco);
    return this.enderecoRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.enderecoRepository.delete(id);
  }
}


