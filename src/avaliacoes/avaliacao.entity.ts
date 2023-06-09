import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Imovel } from '../imoveis/imovel.entity';

@Entity()
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  nota: number;

  
  @ManyToOne(() => User, user => user.avaliacoes)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ManyToOne(() => Imovel, imovel => imovel.avaliacoes)
  @JoinColumn({ name: 'imovelId' })
  imovel: Imovel;
}
