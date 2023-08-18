import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'Usuário não encontrado');
  }
}
