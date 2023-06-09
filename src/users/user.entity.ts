import { Imovel } from '../imoveis/imovel.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imagemPerfil: string;

  @Column()
  nomeUsuario: string;

  @Column()
  senhaUsuario: string;

  @Column()
  emailUsuario: string;

  @Column()
  rendaMensalUsuario: number;

  @Column()
  rgUsuario: string;

  @Column()
  cpfUsuario: string;

  @OneToMany(() => Imovel, imovel => imovel.usuario)
  imoveis: Imovel[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.usuario)
  avaliacoes: Avaliacao[];
}
