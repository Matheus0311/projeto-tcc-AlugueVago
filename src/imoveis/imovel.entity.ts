import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { User } from '../users/user.entity';

@Entity()
export class Imovel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tamanho: number;

  @Column()
  quantidadeComodos: number;

  @Column()
  mobiliado: boolean;

  @Column()
  statusNegociacao: boolean;

  @Column()
  telefoneContato: string;

  @Column()
  emailContato: string;

  @Column('json', { nullable: true })
  fotos: { filename: string; originalname: string }[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ nullable: true })
  pdfDocument: string;

  @Column()
  numeroInscricao: string;

  @Column()
  rgProprietario: string;

  @Column()
  cpfProprietario: string;

  // Propriedades para Endereço e Estado
  @Column()
  enderecoRua: string;

  @Column()
  enderecoNumero: string;

  @Column()
  enderecoBairro: string;

  @Column()
  enderecoCEP: string;

  @Column()
  enderecoCidade: string;

  @Column()
  estadoNome: string;

  @ManyToOne(() => User, user => user.imoveis)
  usuario: User;

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.imovel)
  avaliacoes: Avaliacao[];
}
