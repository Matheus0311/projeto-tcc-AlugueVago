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
  ) {}

  async createImovel(imovel: Imovel): Promise<Imovel> {
    console.log("entrou no createImovel")
    return this.imovelRepository.manager.transaction(async transactionalEntityManager => {
      const savedImovel = await transactionalEntityManager.save(Imovel, imovel);
      return savedImovel;
    });
  }

  async findAll(): Promise<Imovel[]> {
    return this.imovelRepository.find();
  }

  async findOne(id: number): Promise<Imovel> {
    return this.imovelRepository.findOne({ where: { id }, relations: ['usuario'] });
  }

  async findImoveisByUserId(userId: number): Promise<Imovel[]> {
    console.log("entrou aqui");
    return this.imovelRepository.find({ where: { usuario: { id: userId } } });
  }

  async update(id: number, imovel: Imovel): Promise<Imovel> {
    await this.imovelRepository.update(id, imovel);
    return this.imovelRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.imovelRepository.delete(id);
  }
}