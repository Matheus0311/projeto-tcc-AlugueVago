import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Obter o usuário da requisição

    if (user && user.username === 'admin') {
        console.log('É admin');
      return true; // Permite o acesso se o usuário for "admin"
    }else{
        console.log('Não é admin');
        console.log(user);
        return false; // Bloqueia o acesso se o usuário não for "admin"
    }
  }
}
