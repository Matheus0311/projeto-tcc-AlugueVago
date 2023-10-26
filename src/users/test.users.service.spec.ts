import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('Deve criar um novo usuário', async () => {
      const mockUser: User = {
        id: 1,
        nomeUsuario: 'User 1',
        imagemPerfil: null,
        senhaUsuario: 'password',
        emailUsuario: 'user1@example.com',
        rendaMensalUsuario: 1000,
        rgUsuario: '12345678',
        cpfUsuario: '123456789',
        imoveis: [],
        avaliacoes: [],
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const createdUser = await usersService.create(mockUser);

      expect(createdUser).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
