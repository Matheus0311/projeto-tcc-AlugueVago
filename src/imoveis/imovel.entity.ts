import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { User } from '../users/user.entity';
import { Photo } from 'src/photos/photo.entity';

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

  // @Column('json', { nullable: true })
  // fotos: { filename: string; originalname: string }[];

  @OneToMany(() => Photo, (photo) => photo.imovel)
  photos: Photo[]

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

  @Column()
  tipoImovel: string;

  @Column({ nullable: true })
  novo: boolean;

  @Column({ nullable: true })
  grande: boolean;

  @Column({ nullable: true })
  bemLocalizado: boolean;

  @Column({ nullable: true })
  condominioFechado: boolean;

  @Column({ nullable: true })
  estacionamento: boolean;

  @Column({ nullable: true })
  aguaGratuita: boolean;

  @Column({ nullable: true })
  iptuIncluso: boolean;

  @ManyToOne(() => User, user => user.imoveis, { onDelete: 'CASCADE' })
  usuario: User;

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.imovel, { onDelete: 'CASCADE' })
  avaliacoes: Avaliacao[];
}
