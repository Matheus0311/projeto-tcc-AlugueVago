/*import { Imovel } from '../imoveis/imovel.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Imovel, imovel => imovel.usuario)
  imoveis: Imovel[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.usuario)
  avaliacoes: Avaliacao[];
}*/

import { Imovel } from '../imoveis/imovel.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, MinLength, IsPhoneNumber, IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imagemPerfil: string;

  @Column()
  nomeUsuario: string;

  @Column()
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  emailUsuario: string;

  @Column()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senhaUsuario: string;

  @Column()
  rendaMensalUsuario: number;

  // @Column()
  // @IsPhoneNumber('BR', { message: 'O telefone fornecido não é válido.' })
  // telefoneUsuario: string;

  @Column()
  @IsNotEmpty({ message: 'O RG é obrigatório.' })
  rgUsuario: string;

  @Column()
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsNumberString({}, { message: 'O CPF deve conter apenas números.' })
  @Length(11, 11, { message: 'O CPF deve ter 11 dígitos.' })
  @Matches(/^[0-9]{11}$/, { message: 'O CPF fornecido não é válido.' })
  cpfUsuario: string;

  @OneToMany(() => Imovel, imovel => imovel.usuario)
  imoveis: Imovel[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.usuario)
  avaliacoes: Avaliacao[];

}

