import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { UnauthorizedRedirectException } from 'src/exceptions/unauthorized-redirect.exception';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(emailUsuario: string, senhaUsuario: string): Promise<any> {
    const user = await this.authService.validateUser(emailUsuario, senhaUsuario);
    const errorMessage = 'Usuário ou senha incorretos. Tente novamente.';
    const redirectUrl = '/users/login';
    
    if (!user) {
      console.log("user: ", user)
      throw new UnauthorizedRedirectException(errorMessage, redirectUrl);
    }

    if (user.passwordIsNotValid) {
      console.log(user.passwordIsNotValid)
      throw new UnauthorizedRedirectException(errorMessage, redirectUrl)
    }

    return user;
  }
}










// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'email', passwordField: 'senha' });
//   }

//   async validate(emailUsuario: string, senhaUsuario: string): Promise<any> {
//     const user = await this.authService.validateUser(emailUsuario, senhaUsuario)

//     if (!user)
//       throw new UnauthorizedException("Senha ou Email Incorretos")

//     return user
//   }
// }
