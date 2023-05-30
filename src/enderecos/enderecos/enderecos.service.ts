// enderecos/enderecos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco } from './endereco.entity';

@Injectable()
export class EnderecosService {
  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
  ) {}

  async findAll(): Promise<Endereco[]> {
    return this.enderecoRepository.find();
  }

  async create(endereco: Endereco): Promise<Endereco> {
    return this.enderecoRepository.save(endereco);
  }

  async update(id: number, endereco: Endereco): Promise<Endereco> {
    await this.enderecoRepository.update(id, endereco);
    return this.enderecoRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.enderecoRepository.delete(id);
  }
}
