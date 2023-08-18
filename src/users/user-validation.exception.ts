// user-validation.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserValidationException extends HttpException {
  constructor(validationErrors: any) {
    super(
      {
        message: 'Erro de validação de usuário',
        errors: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
