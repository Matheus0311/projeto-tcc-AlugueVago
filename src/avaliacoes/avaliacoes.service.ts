import { Injectable, NotFoundException, ConflictException, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './avaliacao.entity';
import { User } from '../users/user.entity';
import { Imovel } from '../imoveis/imovel.entity';
import { AverageRating } from 'src/imoveis/imoveis.controller';

@Injectable()
export class AvaliacaoService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
  ) {}

  @UsePipes(new ValidationPipe())
  async createOrUpdateAvaliacao(avaliacao: Avaliacao, userId: number, imovelId: number): Promise<Avaliacao> {
    const user = new User();
    user.id = userId;

    const imovel = new Imovel();
    imovel.id = imovelId;

    // Verificar se o usuário já fez uma avaliação para o imóvel
    const existingAvaliacao = await this.avaliacaoRepository.findOne({
      where: { usuario: user, imovel },
    });

    if (existingAvaliacao) {
      // Atualizar a avaliação existente
      existingAvaliacao.nota = avaliacao.nota;
      return this.avaliacaoRepository.save(existingAvaliacao);
    } else {
      // Criar uma nova avaliação
      // Validar a nota da avaliação
      if (avaliacao.nota < 1 || avaliacao.nota > 5) {
        throw new BadRequestException('A nota deve estar entre 1 e 5');
      }

      avaliacao.usuario = user;
      avaliacao.imovel = imovel;

      return this.avaliacaoRepository.save(avaliacao);
    }
  }

  async getUserRating(imovelId: number, userId: number): Promise<Avaliacao | null> {
    const user = new User();
    user.id = userId;
  
    const imovel = new Imovel();
    imovel.id = imovelId;
  
    return this.avaliacaoRepository.findOne({
      where: { usuario: user, imovel: imovel },
    });
  }
  

  async getAverageRating(imovelId: number): Promise<AverageRating> {
    const result = await this.avaliacaoRepository
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.nota)', 'mediaNotas')
      .addSelect('COUNT(avaliacao.id)', 'numAvaliacoes') 
      .where('avaliacao.imovel = :imovelId', { imovelId })
      .getRawOne();
  
    const mediaNotas = result.mediaNotas || 'sem avaliação';
    const numAvaliacoes = result.numAvaliacoes || 0;

  
    return { imovelId, mediaNotas, numAvaliacoes };
  }
  

  async calculateAverageRating(imovelId: number): Promise<AverageRating> {
    const result = await this.avaliacaoRepository
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.nota)', 'mediaNotas')
      .addSelect('COUNT(avaliacao.id)', 'numAvaliacoes') 
      .where('avaliacao.imovel = :imovelId', { imovelId })
      .getRawOne();
  

    const mediaNotas = result.mediaNotas || 'sem avaliação';
    const numAvaliacoes = result.numAvaliacoes || 0;

    return { imovelId, mediaNotas, numAvaliacoes };
  }

  async findAllAvaliacoes(): Promise<Avaliacao[]> {
    return this.avaliacaoRepository.find({ relations: ['usuario', 'imovel'] });
  }

  

  async updateAvaliacao(id: number, updatedAvaliacao: Partial<Avaliacao>): Promise<Avaliacao> {
    console.log('ID:', id);
    console.log('Updated Avaliacao:', updatedAvaliacao);
  
    await this.avaliacaoRepository.update(id, updatedAvaliacao);
  
    // Agora você precisa buscar a avaliação atualizada no banco de dados para retornar
    return this.avaliacaoRepository.findOne({ where: { id }, relations: ['usuario', 'imovel'] });
  }
  

  async deleteAvaliacao(id: number): Promise<void> {
    await this.avaliacaoRepository.delete(id);
  }
}
