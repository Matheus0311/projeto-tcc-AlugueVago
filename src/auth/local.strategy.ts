import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(emailUsuario: string, senhaUsuario: string): Promise<any> {
    const user = await this.authService.validateUser(emailUsuario, senhaUsuario)

    if (!user)
      throw new UnauthorizedException("Senha ou Email Incorretos")

    return user
  }
}
