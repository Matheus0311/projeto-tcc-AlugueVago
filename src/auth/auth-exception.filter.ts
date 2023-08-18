import { Catch, ExceptionFilter, UnauthorizedException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundException } from './user-not-found.exception'; // Importe a exceção

@Catch(UnauthorizedException, UserNotFoundException) // Captura UnauthorizedException e UserNotFoundException
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException | UserNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorMessage = exception.message; 
    const redirectUrl = '/users/login';

    response.render('login.ejs', { error: errorMessage, redirect: redirectUrl });
  }
}
