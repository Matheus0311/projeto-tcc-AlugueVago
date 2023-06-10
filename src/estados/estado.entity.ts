import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Endereco } from '../enderecos/endereco.entity';

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'O nome do estado não pode estar vazio.' })
  @IsString({ message: 'O nome do estado deve ser uma string.' })
  nome: string;

  @OneToMany(() => Endereco, endereco => endereco.estado)
  enderecos: Endereco[];
}
