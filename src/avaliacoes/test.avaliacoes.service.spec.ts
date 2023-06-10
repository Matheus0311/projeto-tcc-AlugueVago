import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoService } from './avaliacoes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Avaliacao } from './avaliacao.entity';
import { User } from '../users/user.entity';
import { Imovel } from '../imoveis/imovel.entity';
import { ConflictException } from '@nestjs/common';
import { Connection } from 'typeorm';

describe('AvaliacaoService', () => {
  let avaliacaoService: AvaliacaoService;
  let avaliacaoRepositoryMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvaliacaoService,
        {
          provide: getRepositoryToken(Avaliacao),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockImplementation((avaliacao) => Promise.resolve({ id: 1, ...avaliacao })),
          },
        },
      ],
    }).compile();

    avaliacaoService = module.get<AvaliacaoService>(AvaliacaoService);
    avaliacaoRepositoryMock = module.get(getRepositoryToken(Avaliacao));
  });

  describe('createAvaliacao', () => {
    it('deve criar e retornar uma nova Avaliacao', async () => {
      const user = new User(); 
      const imovel = new Imovel();

      const userId = 1;
      const imovelId = 1;
      const avaliacaoData = {
        nota: 4.5,
        usuario: user,
        imovel: imovel,
      };

      avaliacaoRepositoryMock.findOne.mockResolvedValueOnce(undefined);

      const result = await avaliacaoService.createAvaliacao(avaliacaoData as Avaliacao, userId, imovelId);

      expect(result).toEqual(expect.objectContaining({ id: 1, ...avaliacaoData }));
      expect(avaliacaoRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(avaliacaoRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: userId }, imovel: { id: imovelId } },
      });
      expect(avaliacaoRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(avaliacaoRepositoryMock.save).toHaveBeenCalledWith(avaliacaoData);
    });

    it('Deve lançar uma ConflictException quando o usuário já fez uma Avaliação para o imóvel', async () => {
      const userId = 1;
      const imovelId = 1;
      const avaliacaoData = {
        nota: 4.5,
        usuario: new User(),
        imovel: new Imovel(),
      };

      const existingAvaliacao = new Avaliacao();
      avaliacaoRepositoryMock.findOne.mockResolvedValueOnce(existingAvaliacao);

      await expect(
        avaliacaoService.createAvaliacao(avaliacaoData as Avaliacao, userId, imovelId),
      ).rejects.toThrow(ConflictException);

      expect(avaliacaoRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(avaliacaoRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: userId }, imovel: { id: imovelId } },
      });
      expect(avaliacaoRepositoryMock.save).not.toHaveBeenCalled();
    });
  });
  
  
});

