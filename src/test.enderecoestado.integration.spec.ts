import { Test } from '@nestjs/testing';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';
import { EnderecoService } from './enderecos/enderecos.service';
import { EstadoService } from './estados/estados.service';
import { Endereco } from './enderecos/endereco.entity';
import { Estado } from './estados/estado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Endereco and Estado Integration', () => {
  let enderecoService: EnderecoService;
  let estadoService: EstadoService;
  let createdEstado: Estado;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
          }),
      ],
    }).compile();

    enderecoService = moduleFixture.get<EnderecoService>(EnderecoService);
    estadoService = moduleFixture.get<EstadoService>(EstadoService);

    // Cria um novo Estado para usar no teste
    const estadoData = {
      nome: 'Estado de Teste',
    };
    createdEstado = await estadoService.create(estadoData as Estado);
  });

  it('should create Endereco with associated Estado', async () => {
    const enderecoData = {
      rua: 'Rua Exemplo',
      bairro: 'Bairro Exemplo',
      numero: '123',
      cep: '12345-678',
      cidade: 'Cidade Exemplo',
      estado: createdEstado,
    };

    const createdEndereco = await enderecoService.create(enderecoData as Endereco);

    expect(createdEndereco.id).toBeDefined();
    expect(createdEndereco.rua).toEqual(enderecoData.rua);
    expect(createdEndereco.bairro).toEqual(enderecoData.bairro);
    expect(createdEndereco.numero).toEqual(enderecoData.numero);
    expect(createdEndereco.cep).toEqual(enderecoData.cep);
    expect(createdEndereco.cidade).toEqual(enderecoData.cidade);
    expect(createdEndereco.estado).toEqual(createdEstado);
  });
});
