import { Test } from '@nestjs/testing';
import { EstadoService } from './estados.service';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EstadoService', () => {
  let estadoService: EstadoService;
  let estadoRepository: Repository<Estado>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EstadoService,
        {
          provide: getRepositoryToken(Estado),
          useClass: Repository, // Usando a classe Repository do TypeORM
        },
      ],
    }).compile();

    estadoService = moduleRef.get<EstadoService>(EstadoService);
    estadoRepository = moduleRef.get<Repository<Estado>>(getRepositoryToken(Estado));
  });

  describe('findAll', () => {
    it('Deve retornar um array de estados', async () => {
      const mockEstados: Estado[] = [
        { id: 1, nome: 'Estado 1', enderecos: [] },
        { id: 2, nome: 'Estado 2', enderecos: [] },
      ];

      jest
        .spyOn(estadoRepository, 'find')
        .mockResolvedValue(mockEstados);

      const estados = await estadoService.findAll();

      expect(estados).toEqual(mockEstados);
      expect(estadoRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('Deve criar um novo estado', async () => {
      const mockEstado: Estado = {
        id: 1,
        nome: 'Estado 1',
        enderecos: [],
      };

      jest.spyOn(estadoRepository, 'save').mockResolvedValue(mockEstado);

      const createdEstado = await estadoService.create(mockEstado);

      expect(createdEstado).toEqual(mockEstado);
      expect(estadoRepository.save).toHaveBeenCalledWith(mockEstado);
    });
  });

  describe('findOne', () => {
    it('Deve retornar um estado com o id fornecido', async () => {
      const mockEstado: Estado = {
        id: 1,
        nome: 'Estado 1',
        enderecos: [],
      };

      jest
        .spyOn(estadoRepository, 'findOne')
        .mockResolvedValue(mockEstado);

      const estado = await estadoService.findOne(1);

      expect(estado).toEqual(mockEstado);
      expect(estadoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('Deve atualizar o estado com o id fornecido', async () => {
      const mockEstado: Estado = {
        id: 1,
        nome: 'Estado 1',
        enderecos: [],
      };

      jest.spyOn(estadoRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(estadoRepository, 'findOne')
        .mockResolvedValue(mockEstado);

      const updatedEstado = await estadoService.update(1, mockEstado);

      expect(updatedEstado).toEqual(mockEstado);
      expect(estadoRepository.update).toHaveBeenCalledWith(1, mockEstado);
      expect(estadoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('delete', () => {
    it('Deve deletar um estado com o id fornecido', async () => {
      jest.spyOn(estadoRepository, 'delete').mockResolvedValue(undefined);

      await estadoService.delete(1);

      expect(estadoRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
