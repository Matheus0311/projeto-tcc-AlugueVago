import { Endereco } from '../enderecos/endereco.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Endereco, endereco => endereco.estado)
  enderecos: Endereco[];
}