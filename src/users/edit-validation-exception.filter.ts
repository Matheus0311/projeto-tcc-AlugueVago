import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class UserValidationAndEditExceptionFilter extends BaseExceptionFilter {
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

      response.render('edit-user.ejs', { errorMessages });
    } else {
      super.catch(exception, host);
    }
  }
}
