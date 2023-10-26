import { Injectable, NotAcceptableException  } from '@nestjs/common';
import { truncate } from 'fs';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from './user-not-found.exception';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new UserNotFoundException(); 
    }
      const passwordIsValid = await this.usersService.comparePasswords(password, user.senhaUsuario)

    if (!passwordIsValid) {
      return { passwordIsNotValid: true }
    }

    if (user && passwordIsValid)
      return { id: user.id, username: user.nomeUsuario, email: user.emailUsuario }

    return null
  }
}
