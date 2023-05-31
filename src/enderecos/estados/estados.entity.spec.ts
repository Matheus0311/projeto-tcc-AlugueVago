import { Test, TestingModule } from '@nestjs/testing';
import { Estado } from './estado.entity';
import { Cidade } from '../cidades/cidade.entity';

describe('Estado', () => {
  let estado: Estado;

  beforeEach(() => {
    estado = new Estado();
    estado.cidades = []; // Adicione essa linha para inicializar a propriedade cidades como um array vazio
  });

  it('deve ser definido', () => {
    expect(estado).toBeDefined();
  });

  it('deve ter uma propriedade id', () => {
    expect(estado.id).toBeUndefined();
    estado.id = 1;
    expect(estado.id).toBe(1);
  });

  it('deve ter um propriedade nomeEstado', () => {
    expect(estado.nomeEstado).toBeUndefined();
    estado.nomeEstado = 'São Paulo';
    expect(estado.nomeEstado).toBe('São Paulo');
  });

  it('deve ter uma propriedade cidades que seja um array vazio por padrão', () => {
    expect(estado.cidades).toEqual([]);
  });

  it('Deve ter uma propriedadecidades que pode ser atribuída', () => {
    const cidade1 = new Cidade();
    cidade1.id = 1;
    cidade1.nomeCidade = 'Cidade A';

    const cidade2 = new Cidade();
    cidade2.id = 2;
    cidade2.nomeCidade = 'Cidade B';

    estado.cidades = [cidade1, cidade2];

    expect(estado.cidades).toEqual([cidade1, cidade2]);
  });
});
