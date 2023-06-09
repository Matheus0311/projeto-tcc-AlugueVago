import { EnderecoService } from './enderecos.service';
import { Repository } from 'typeorm';
import { Endereco } from './endereco.entity';

describe('EnderecoService', () => {
  // Criando um mock para o EnderecoRepository
  const enderecoRepositoryMock: Partial<Repository<Endereco>> = {
    findOne: jest.fn().mockReturnValue({
      id: 1,
      rua: 'Rua A',
      cidade: 'Cidade A',
      bairro: 'Bairro A',
      estado: 1,
      cep: '12345-678',
    }),
  };

  // Criando uma instância do EnderecoService com o mock do EnderecoRepository
  const enderecoService = new EnderecoService(enderecoRepositoryMock as Repository<Endereco>);

  // Teste para o método findOne do EnderecoRepository
  it('deve retornar um endereço pelo ID', async () => {
    const enderecoId = 1;
    const endereco = await enderecoService.findOne(enderecoId); // Tratar o retorno como uma promessa

    // Verificando se o método findOne do mock foi chamado corretamente
    expect(enderecoRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id: enderecoId,
      },
    });

    // Verificando se o resultado está correto
    expect(endereco).toEqual({
      id: 1,
      rua: 'Rua A',
      cidade: 'Cidade A',
      bairro: 'Bairro A',
      estado: 1,
      cep: '12345-678',
    });
  });
});
