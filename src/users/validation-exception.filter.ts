// user-validation-exception.filter.ts




// import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';
// import { Response } from 'express';
// import { ValidationError } from 'class-validator';

// @Catch(HttpException)
// export class UserValidationExceptionFilter extends BaseExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
//       const validationErrors = exception.getResponse() as Record<string, any>;
//       const errorMessages: string[] = [];

//       if (Array.isArray(validationErrors.message)) {
//         errorMessages.push(...validationErrors.message);
//       } else if (typeof validationErrors.message === 'string') {
//         errorMessages.push(validationErrors.message);
//       }

//       console.log("Está no validation: ", errorMessages);

//       // Ajuste o template a ser renderizado para a edição de usuário
//       response.render('cadastro.ejs', { errorMessages });
//     } else {
//       super.catch(exception, host);
//     }
//   }
// }



import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { UsersService } from './users.service';

@Catch(HttpException)
export class UserValidationExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      const validationErrors = exception.getResponse() as Record<string, any>;
      const errorMessages: string[] = [];

      if (Array.isArray(validationErrors.message)) {
        errorMessages.push(...validationErrors.message);
      } else if (typeof validationErrors.message === 'string') {
        errorMessages.push(validationErrors.message);
      }

      let userIsLoggedIn = false;
      let user = null;

      if (request.isAuthenticated()) {
        userIsLoggedIn = true;
        user = await this.usersService.findById(request.user.id);
      }

      console.log("Está no validation: ", errorMessages);

      if (request.url.includes('/edit/:id')) {
        console.log("edit-user");
        response.render('edit-user.ejs', { errorMessages });
      } else if (request.url.includes('/users/cadastro')) {
        console.log("cadastro");
        response.render('cadastro.ejs', { errorMessages });
      } else if (request.url.includes('/imoveis/cadastro-imovel')) {
        console.log('Cadastro de Imóvel');
        response.render('cadastro-imovel.ejs', { user, userIsLoggedIn, errorMessages });
      }
    } else {
      super.catch(exception, host);
    }
  }
}










// import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';
// import { Response, Request } from 'express';
// import { UserValidationException } from './user-validation.exception';

// @Catch(UserValidationException)
// export class UserValidationExceptionFilter extends BaseExceptionFilter {
//   catch(exception: UserValidationException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     console.log("Está no UserValidationException");

//     const errorMessage = exception.message;
//     const validationErrors = exception.getResponse()['errors']; // Obter os erros de validação

//     response.render('cadastro.ejs', { error: errorMessage, errorMessages: validationErrors });
//   }
// }


/* 

import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class UserValidationExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      const validationErrors = exception.getResponse() as Record<string, any>;
      const errorMessages: string[] = [];

      if (Array.isArray(validationErrors.message)) {
        errorMessages.push(...validationErrors.message);
      } else if (typeof validationErrors.message === 'string') {
        errorMessages.push(validationErrors.message);
      }

      console.log("Está no validation: ", errorMessages);

      response.render('cadastro.ejs', { errorMessages });
    } else {
      super.catch(exception, host);
    }
  }
}


*/
