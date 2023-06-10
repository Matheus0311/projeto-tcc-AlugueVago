import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Usando a classe Repository do TypeORM
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('Deve retornar um array de usuários', async () => {
      const mockUsers: User[] = [
        {
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
        },
        {
          id: 2,
          nomeUsuario: 'User 2',
          imagemPerfil: null,
          senhaUsuario: 'password',
          emailUsuario: 'user2@example.com',
          rendaMensalUsuario: 2000,
          rgUsuario: '87654321',
          cpfUsuario: '987654321',
          imoveis: [],
          avaliacoes: [],
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      const users = await usersService.findAll();

      expect(users).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalled();
    });
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
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const createdUser = await usersService.create(mockUser);

      expect(createdUser).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('Deve atualizar um usuário com o id fornecido', async () => {
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

      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const updatedUser = await usersService.update(1, mockUser);

      expect(updatedUser).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith(1, mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('delete', () => {
    it('Deve deletar um usuário com o id fornecido', async () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await usersService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
