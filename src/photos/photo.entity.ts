import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { User } from '../users/user.entity';
import { Imovel } from 'src/imoveis/imovel.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @ManyToOne(() => Imovel, (imovel) => imovel.photos, { onDelete: 'CASCADE' })
  imovel: Imovel
}
