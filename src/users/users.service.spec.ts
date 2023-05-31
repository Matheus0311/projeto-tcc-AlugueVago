import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';


//testando a senha
describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUserRepository = {
      save: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('hashPassword', () => {
    it('deve gerar o hash da senha corretamente', async () => {
      const password = 'password123';
      const result = await usersService['hashPassword'](password);
      const isPasswordMatched = await bcrypt.compare(password, result);
      expect(isPasswordMatched).toBe(true);
    });
  });
});


//testando o create

describe('UsersService', () => {
    let usersService: UsersService;
  
    beforeEach(async () => {
      const mockUserRepository = {
        save: jest.fn(),
      };
  
      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          { provide: 'UserRepository', useValue: mockUserRepository },
        ],
      }).compile();
  
      usersService = moduleRef.get<UsersService>(UsersService);
    });

  describe('create', () => {
    it('should create a user', async () => {
      const user: User = {
        id: 1,
        nomeUsuario: 'John Doe',
        senhaUsuario: 'password',
        imagemPerfil: 'image.jpg',
        emailUsuario: 'john.doe@example.com',
        rendaMensalUsuario: 1000,
        rgUsuario: '123456789',
        cpfUsuario: '12345678901',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await usersService.create(user);

      expect(result).toEqual(user);
      expect(usersService.create).toHaveBeenCalledWith(user);
    });
  });
});
