import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imovel } from './imovel.entity';
import { Endereco } from '../enderecos/endereco.entity';

@Injectable()
export class ImovelService {
  constructor(
    @InjectRepository(Imovel)
    private readonly imovelRepository: Repository<Imovel>,
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
  ) {}

  async createImovelWithEndereco(imovel: Imovel, endereco: Endereco): Promise<Imovel> {
    return this.imovelRepository.manager.transaction(async transactionalEntityManager => {
      const savedEndereco = await transactionalEntityManager.save(Endereco, endereco);
      imovel.endereco = savedEndereco;
      return transactionalEntityManager.save(Imovel, imovel);
    });
  }

  async findAll(): Promise<Imovel[]> {
    return this.imovelRepository.find({ relations: ['endereco', 'usuario'] });
  }

  async findOne(id: number): Promise<Imovel> {
    return this.imovelRepository.findOne({ where: { id }, relations: ['usuario'] });
  }

  async update(id: number, imovel: Imovel): Promise<Imovel> {
    await this.imovelRepository.update(id, imovel);
    return this.imovelRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.imovelRepository.delete(id);
  }
}
