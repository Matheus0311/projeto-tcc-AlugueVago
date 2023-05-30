// enderecos/estados/estado.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cidade } from '../cidades/cidade.entity';

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeEstado: string;

  @OneToMany(() => Cidade, cidade => cidade.estado)
  cidades: Cidade[];
}
