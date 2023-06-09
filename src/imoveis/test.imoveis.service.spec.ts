import { Test, TestingModule } from '@nestjs/testing';
import { Imovel } from './imovel.entity';

describe('Imovel', () => {
  let imovel: Imovel;

  beforeEach(() => {
    imovel = new Imovel();
    imovel.id = 1;
    imovel.tamanho = 100;
    imovel.quantidadeComodos = 4;
    imovel.mobiliado = true;
    imovel.statusNegociacao = true;
    imovel.telefoneContato = '123456789';
    imovel.emailContato = 'exemplo@ex.com';
    imovel.valor = 12000.00;
    imovel.descricao = 'Salão com 4 salas';
    imovel.pdfDocument = 'caminho/caminho/exemplo.pdf';
    imovel.numeroInscricao = '1234221';
    imovel.rgProprietario = '123456789';
    imovel.cpfProprietario = '1234321232';
  });

  it('should create an instance of Imovel', () => {
    expect(imovel).toBeDefined();
    expect(imovel).toBeInstanceOf(Imovel);
  });

  it('should have all properties set correctly', () => {
    expect(imovel.id).toEqual(1);
    expect(imovel.tamanho).toEqual(100);
    expect(imovel.quantidadeComodos).toEqual(4);
    expect(imovel.mobiliado).toEqual(true);
    expect(imovel.statusNegociacao).toEqual(true);
    expect(imovel.telefoneContato).toEqual('123456789');
    expect(imovel.emailContato).toEqual('exemplo@ex.com');
    expect(imovel.valor).toEqual(12000.00);
    expect(imovel.descricao).toEqual('Salão com 4 salas');
    expect(imovel.pdfDocument).toEqual('caminho/caminho/exemplo.pdf');
    expect(imovel.numeroInscricao).toEqual('1234221');
    expect(imovel.rgProprietario).toEqual('123456789');
    expect(imovel.cpfProprietario).toEqual('1234321232');
  });
});
