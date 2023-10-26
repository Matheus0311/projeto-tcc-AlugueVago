import { Test, TestingModule } from '@nestjs/testing';
import { ImovelService } from './imoveis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Imovel } from './imovel.entity';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm';


describe('ImovelService', () => {
  let service: ImovelService;
  let repository: Repository<Imovel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImovelService,
        {
          provide: getRepositoryToken(Imovel),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ImovelService>(ImovelService);
    repository = module.get<Repository<Imovel>>(getRepositoryToken(Imovel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find an Imovel by id', async () => {
    const mockImovel = new Imovel();
    mockImovel.id = 1;
    jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(mockImovel));

    const result = await service.findById(1);

    expect(result).toEqual(mockImovel);
  });

  it('should return null for an unknown Imovel id', async () => {
    jest.spyOn(repository, 'findOne').mockImplementation(async (options: any) => {
      if (options.where?.id === 999) return null; 
    });
    
  
    const result = await service.findById(999);
  
    expect(result).toBeNull();
  });
  

});
