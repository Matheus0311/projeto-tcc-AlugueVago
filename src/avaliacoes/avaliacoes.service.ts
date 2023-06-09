import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './avaliacao.entity';
import { User } from '../users/user.entity';
import { Imovel } from '../imoveis/imovel.entity';

@Injectable()
export class AvaliacaoService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
  ) {}

  async createAvaliacao(avaliacao: Avaliacao, userId: number, imovelId: number): Promise<Avaliacao> {
    const user = new User();
    user.id = userId;

    const imovel = new Imovel();
    imovel.id = imovelId;

    // Verificar se o usuário já fez uma avaliação para o imóvel
    const existingAvaliacao = await this.avaliacaoRepository.findOne({
      where: { usuario: user, imovel },
    });

    if (existingAvaliacao) {
      throw new ConflictException('Usuário já fez uma avaliação para esse imóvel');
    }

    avaliacao.usuario = user;
    avaliacao.imovel = imovel;

    return this.avaliacaoRepository.save(avaliacao);
  }

  async findAllAvaliacoes(): Promise<Avaliacao[]> {
    return this.avaliacaoRepository.find({ relations: ['usuario', 'imovel'] });
  }

  async updateAvaliacao(id: number, avaliacao: Avaliacao): Promise<Avaliacao> {
    await this.avaliacaoRepository.update(id, avaliacao);
    return this.avaliacaoRepository.findOne({ where: { id }, relations: ['usuario', 'imovel'] });
  }

  async deleteAvaliacao(id: number): Promise<void> {
    await this.avaliacaoRepository.delete(id);
  }
}
