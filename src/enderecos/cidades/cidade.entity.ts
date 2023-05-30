// enderecos/cidades/cidade.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Estado } from '../estados/estado.entity';
import { Endereco } from '../enderecos/endereco.entity';

@Entity()
export class Cidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeCidade: string;

  @ManyToOne(() => Estado, estado => estado.cidades)
  estado: Estado;

  @OneToMany(() => Endereco, endereco => endereco.cidade)
  enderecos: Endereco[];
}
