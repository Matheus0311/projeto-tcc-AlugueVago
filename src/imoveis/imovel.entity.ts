import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Endereco } from '../enderecos/endereco.entity';
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

  @ManyToOne(() => User, user => user.imoveis)
  usuario: User;

@ManyToOne(() => Endereco, endereco => endereco.imovel)
  endereco: Endereco;

@OneToMany(() => Avaliacao, avaliacao => avaliacao.imovel)
  avaliacoes: Avaliacao[];

}