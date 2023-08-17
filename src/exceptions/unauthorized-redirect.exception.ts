// src/exceptions/unauthorized-redirect.exception.ts

import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedRedirectException extends UnauthorizedException {
  constructor(message: string, redirectUrl: string) {
    super(message);
    this.redirect = redirectUrl;
  }

  redirect: string;
}
