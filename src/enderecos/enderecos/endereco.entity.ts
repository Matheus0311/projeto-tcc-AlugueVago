// enderecos/enderecos/endereco.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cidade } from '../cidades/cidade.entity';

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rua: string;

  @Column()
  bairro: string;

  @Column()
  numero: string;

  @Column()
  cep: string;

  @ManyToOne(() => Cidade, cidade => cidade.enderecos)
  cidade: Cidade;

}
