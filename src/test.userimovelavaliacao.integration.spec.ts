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
import { Photo } from './photos/photo.entity';

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
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  it('Deve criar um usuário, um imóvel, e uma avaliação', async () => {
    // Criar um usuário de teste
    const user = new User();
    user.nomeUsuario = 'John Doe';
    user.senhaUsuario = '123456';
    user.emailUsuario = 'johndoe@example.com';
    user.rendaMensalUsuario = 5000;
    user.rgUsuario = '123456789';
    user.cpfUsuario = '987654321';

    const createdUser = await userRepository.save(user);

    // Criar um imóvel de teste
    const imovelEntity = new Imovel();
    imovelEntity.tamanho = 100;
    imovelEntity.quantidadeComodos = 3;
    imovelEntity.mobiliado = true;
    imovelEntity.statusNegociacao = true;
    imovelEntity.telefoneContato = '987654321';
    imovelEntity.emailContato = 'imovel@example.com';
    imovelEntity.valor = 100000;
    imovelEntity.titulo = 'Lindo apartamento';
    imovelEntity.descricao = 'Descrição do imóvel';
    imovelEntity.pdfDocument = 'caminho/do/pdf.pdf';
    imovelEntity.numeroInscricao = '123456';
    imovelEntity.rgProprietario = '987654321';
    imovelEntity.cpfProprietario = '123456789';
    imovelEntity.enderecoRua = 'Rua do Imóvel';
    imovelEntity.enderecoNumero = '123';
    imovelEntity.enderecoBairro = 'Bairro do Imóvel';
    imovelEntity.enderecoCEP = '12345-678';
    imovelEntity.enderecoCidade = 'Cidade do Imóvel';
    imovelEntity.estadoNome = 'Estado do Imóvel';
    imovelEntity.tipoImovel = 'Casa';
    imovelEntity.novo = true;
    imovelEntity.grande = false;
    imovelEntity.bemLocalizado = true;
    imovelEntity.condominioFechado = false;
    imovelEntity.estacionamento = true;
    imovelEntity.aguaGratuita = false;
    imovelEntity.iptuIncluso = true;
    imovelEntity.usuario = createdUser;

    const photos = [new Photo()]; 
    const pdfDocument = null;

    const createdImovel = await imovelRepository.save(imovelEntity);

    // Criar uma avaliação de teste
    const avaliacao = new Avaliacao();
    avaliacao.nota = 5;
    avaliacao.usuario = createdUser;
    avaliacao.imovel = createdImovel;

    const createdAvaliacao = await avaliacaoRepository.save(avaliacao);

    expect(createdUser.id).toBeDefined();
    expect(createdImovel.id).toBeDefined();
    expect(createdAvaliacao.id).toBeDefined();

    // Exclua o usuário criado para o teste
    await userRepository.remove(createdUser);

  });
});
