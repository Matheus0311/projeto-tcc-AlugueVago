import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { ProfileController } from 'src/users/profile.controller';
import { AuthExceptionFilter } from './auth-exception.filter'; 
@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController, ProfileController],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter, 
    },
  ],
})
export class AuthModule {}
