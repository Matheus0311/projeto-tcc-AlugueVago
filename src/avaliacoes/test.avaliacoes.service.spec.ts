import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoController } from './avaliacoes.controller';
import { AvaliacaoService } from './avaliacoes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Avaliacao } from './avaliacao.entity';

describe('AvaliacaoController', () => {
  let controller: AvaliacaoController;
  let service: AvaliacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacaoController],
      providers: [
        AvaliacaoService,
        {
          provide: getRepositoryToken(Avaliacao),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AvaliacaoController>(AvaliacaoController);
    service = module.get<AvaliacaoService>(AvaliacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user rating', async () => {
    const mockAvaliacao = new Avaliacao();
    const mockUserId = 1;
    const mockImovelId = 2;

    jest.spyOn(service, 'getUserRating').mockResolvedValue(mockAvaliacao);

    const result = await controller.getUserRating(mockImovelId, mockUserId);

    expect(result).toBe(mockAvaliacao);
    expect(service.getUserRating).toHaveBeenCalledWith(mockImovelId, mockUserId);
  });

});
