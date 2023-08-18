import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserValidationExceptionFilter } from './validation-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { UserValidationAndEditExceptionFilter } from './edit-validation-exception.filter';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: UserValidationExceptionFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: UserValidationAndEditExceptionFilter, 
    // },
  ],
  exports: [UsersService],
})
export class UsersModule {}
