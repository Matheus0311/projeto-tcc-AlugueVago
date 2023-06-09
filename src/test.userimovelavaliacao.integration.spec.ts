import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from './users/user.entity';
import { Imovel } from './imoveis/imovel.entity';
import { Avaliacao } from './avaliacoes/avaliacao.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AvaliacaoService } from './avaliacoes/avaliacoes.service';
import { UsersService } from './users/users.service';
import { ImovelService } from './imoveis/imoveis.service';
import { Endereco } from './enderecos/endereco.entity';

describe('Integration Test: User, Imovel, Avaliacao', () => {
  let app: TestingModule;
  let connection: Connection;
  let avaliacaoService: AvaliacaoService;
  let userService: UsersService;
  let imovelService: ImovelService;
  let userRepository: Repository<User>;
  let imovelRepository: Repository<Imovel>;
  let avaliacaoRepository: Repository<Avaliacao>;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    connection = app.get(Connection);
    avaliacaoService = app.get(AvaliacaoService);
    userService = app.get(UsersService);
    imovelService = app.get(ImovelService);
    userRepository = app.get(getRepositoryToken(User));
    imovelRepository = app.get(getRepositoryToken(Imovel));
    avaliacaoRepository = app.get(getRepositoryToken(Avaliacao));

   // await connection.synchronize(true); // Limpar e recriar o banco de dados antes dos testes
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  it('should create a user, an imovel, and an avaliacao', async () => {
    const endereco = new Endereco();
    endereco.id = 1;
    endereco.rua = 'Rua A';
    endereco.cidade = 'Cidade A';
    endereco.bairro = 'Bairro A';
    endereco.estado = null;
    endereco.cep = '12345-678';
  
    const createdUser = new User();
    createdUser.imagemPerfil = 'imagem.png';
    createdUser.nomeUsuario = 'John Doe';
    createdUser.senhaUsuario = '123456';
    createdUser.emailUsuario = 'johndoe@example.com';
    createdUser.rendaMensalUsuario = 5000;
    createdUser.rgUsuario = '123456789';
    createdUser.cpfUsuario = '987654321';
  
    const user = await userService.create(createdUser);
  
    const imovelEntity = new Imovel();
    imovelEntity.tamanho = 100;
    imovelEntity.quantidadeComodos = 3;
    imovelEntity.mobiliado = true;
    imovelEntity.statusNegociacao = true;
    imovelEntity.telefoneContato = '987654321';
    imovelEntity.emailContato = 'imovel@example.com';
    imovelEntity.valor = 100000;
    imovelEntity.descricao = 'Lindo apartamento';
    imovelEntity.numeroInscricao = '123456';
    imovelEntity.rgProprietario = '987654321';
    imovelEntity.cpfProprietario = '123456789';
    imovelEntity.usuario = createdUser;
  
    const createdImovelWithEndereco = await imovelService.createImovelWithEndereco(imovelEntity, endereco);
  
    const avaliacao = new Avaliacao();
    avaliacao.nota = 5;
    avaliacao.usuario = createdUser;
    avaliacao.imovel = createdImovelWithEndereco;
  
    const createdAvaliacao = await avaliacaoService.createAvaliacao(avaliacao, createdUser.id, createdImovelWithEndereco.id);
  
    expect(createdUser.id).toBeDefined();
    expect(createdImovelWithEndereco.id).toBeDefined();
    expect(createdAvaliacao.id).toBeDefined();
  });
  
  
  
  
  
  

  
});
