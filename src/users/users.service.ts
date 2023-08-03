import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(user: User): Promise<User> {
    const { emailUsuario, rgUsuario, cpfUsuario } = user;

    // Check for existing users with the same email, RG, or CPF
    const existingUser = await this.userRepository.findOne({
      where: [
        { emailUsuario },
        { rgUsuario },
        { cpfUsuario },
      ],
    });

    if (existingUser) {
      const errorMessages = [];

      if (existingUser.emailUsuario === emailUsuario) {
        errorMessages.push('O email fornecido já está em uso.');
      }

      if (existingUser.rgUsuario === rgUsuario) {
        errorMessages.push('O RG fornecido já está em uso.');
      }

      if (existingUser.cpfUsuario === cpfUsuario) {
        errorMessages.push('O CPF fornecido já está em uso.');
      }

      if (errorMessages.length > 0) {
        throw new ConflictException(errorMessages);
      }
    }

    // Hash the password and save the user
    const hashedPassword = await this.hashPassword(user.senhaUsuario);
    user.senhaUsuario = hashedPassword;

    return this.userRepository.save(user);
  }

  async update(id: number, user: User): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { emailUsuario: email } });
  } 
  
  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: id } });
  }  

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

}
