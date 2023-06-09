import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Repository, FindOneOptions } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Imovel } from './imoveis/imovel.entity';
import { Endereco } from './enderecos/endereco.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImovelService } from './imoveis/imoveis.service';
import { EnderecoService } from './enderecos/enderecos.service';

describe('Integration Test: Imovel and Endereco', () => {
  let app: TestingModule;
  let connection: Connection;
  let imovelService: ImovelService;
  let enderecoService: EnderecoService;
  let imovelRepository: Repository<Imovel>;
  let enderecoRepository: Repository<Endereco>;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    connection = app.get(Connection);
    imovelService = app.get(ImovelService);
    enderecoService = app.get(EnderecoService);
    imovelRepository = app.get(getRepositoryToken(Imovel));
    enderecoRepository = app.get(getRepositoryToken(Endereco));

    //await connection.synchronize(true); // Limpar e recriar o banco de dados antes dos testes
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  it('should create an Imovel with an Endereco', async () => {
    const endereco = new Endereco();
    endereco.rua = 'Rua A';
    endereco.bairro = 'Bairro A';
    endereco.numero = '123';
    endereco.cep = '12345-678';
    endereco.cidade = 'Cidade A';

    const imovel = new Imovel();
    imovel.tamanho = 100;
    imovel.quantidadeComodos = 3;
    imovel.mobiliado = true;
    imovel.statusNegociacao = true;
    imovel.telefoneContato = '987654321';
    imovel.emailContato = 'imovel@example.com';
    imovel.valor = 100000;
    imovel.descricao = 'Lindo apartamento';
    imovel.numeroInscricao = '123456';
    imovel.rgProprietario = '987654321';
    imovel.cpfProprietario = '123456789';

    const createdImovelWithEndereco = await imovelService.createImovelWithEndereco(imovel, endereco);

    const createdImovel = await imovelRepository
      .createQueryBuilder('imovel')
      .leftJoinAndSelect('imovel.endereco', 'endereco')
      .where('imovel.id = :id', { id: createdImovelWithEndereco.id })
      .getOne();

    const createdEndereco = createdImovel.endereco;

    expect(createdImovelWithEndereco.id).toBeDefined();
    expect(createdImovelWithEndereco.endereco).toBeDefined();
    expect(createdImovelWithEndereco.endereco.id).toBeDefined();
    expect(createdImovelWithEndereco.endereco.rua).toBe(endereco.rua);
    expect(createdImovelWithEndereco.endereco.bairro).toBe(endereco.bairro);
    expect(createdImovelWithEndereco.endereco.numero).toBe(endereco.numero);
    expect(createdImovelWithEndereco.endereco.cep).toBe(endereco.cep);
    expect(createdImovelWithEndereco.endereco.cidade).toBe(endereco.cidade);

    expect(createdImovel).toBeDefined();
    expect(createdImovel.endereco).toBeDefined();
    expect(createdImovel.endereco.id).toBe(createdEndereco.id);
    expect(createdImovel.endereco.rua).toBe(endereco.rua);
    expect(createdImovel.endereco.bairro).toBe(endereco.bairro);
    expect(createdImovel.endereco.numero).toBe(endereco.numero);
    expect(createdImovel.endereco.cep).toBe(endereco.cep);
    expect(createdImovel.endereco.cidade).toBe(endereco.cidade);
  });
});
