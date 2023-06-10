import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Imovel } from '../imoveis/imovel.entity';
import { Estado } from '../estados/estado.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'A Rua é obrigatória.' })
  @IsString()
  rua: string;

  @Column()
  @IsNotEmpty({ message: 'O Bairro é obrigatório.' })
  @IsString()
  bairro: string;

  @Column()
  @IsNotEmpty({ message: 'O Número é obrigatório.' })
  @IsString()
  numero: string;

  @Column()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @IsString()
  cep: string;

  @Column()
  @IsNotEmpty({ message: 'A Cidade é obrigatória.' })
  @IsString()
  cidade: string;

  @OneToOne(() => Imovel, imovel => imovel.endereco)
  imovel: Imovel;

  @ManyToOne(() => Estado, estado => estado.enderecos)
  estado: Estado;
}
