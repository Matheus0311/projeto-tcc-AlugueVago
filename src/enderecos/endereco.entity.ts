import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Imovel } from '../imoveis/imovel.entity';
import { Estado } from '../estados/estado.entity';


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

  @Column()
  cidade: string;

@OneToOne(() => Imovel, imovel => imovel.endereco)
  imovel: Imovel;

  @ManyToOne(() => Estado, estado => estado.enderecos)
estado: Estado;

}
