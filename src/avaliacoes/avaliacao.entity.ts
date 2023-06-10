import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { User } from '../users/user.entity';
import { Imovel } from '../imoveis/imovel.entity';

@Entity()
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  @IsNotEmpty({ message: 'A nota não pode estar vazia.' })
  @IsNumber({}, { message: 'A nota deve ser um valor numérico.' })
  nota: number;

  @ManyToOne(() => User, user => user.avaliacoes)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ManyToOne(() => Imovel, imovel => imovel.avaliacoes)
  @JoinColumn({ name: 'imovelId' })
  imovel: Imovel;
}


