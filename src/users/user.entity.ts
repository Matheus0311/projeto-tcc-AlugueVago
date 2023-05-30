import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imagemPerfil: string;

  @Column()
  nomeUsuario: string;

  @Column()
  senhaUsuario: string;

  @Column()
  emailUsuario: string;

  @Column()
  rendaMensalUsuario: number;

  @Column()
  rgUsuario: string;

  @Column()
  cpfUsuario: string;
}
