import { Injectable, NotAcceptableException  } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!user)
      throw new NotAcceptableException('User not found')

    const passwordIsValid = await this.usersService.comparePasswords(password, user.senhaUsuario)

    if (user && passwordIsValid)
      return { id: user.id, username: user.nomeUsuario, email: user.emailUsuario }

    return null
  }
}
