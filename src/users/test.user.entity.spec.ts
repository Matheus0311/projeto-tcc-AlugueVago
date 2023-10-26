import { User } from './user.entity';

describe('User Entity', () => {
  it('should be defined', () => {
    const user = new User();
    expect(user).toBeDefined();
  });

  it('should create a user entity', () => {
    const user = new User();
    user.id = 1;
    user.imagemPerfil = 'profile.jpg';
    user.nomeUsuario = 'John Doe';
    user.emailUsuario = 'john@example.com';
    user.senhaUsuario = 'password123';
    user.rendaMensalUsuario = 5000;
    user.rgUsuario = '1234567';
    user.cpfUsuario = '12345678901';

    expect(user.id).toEqual(1);
    expect(user.imagemPerfil).toEqual('profile.jpg');
    expect(user.nomeUsuario).toEqual('John Doe');
    expect(user.emailUsuario).toEqual('john@example.com');
    expect(user.senhaUsuario).toEqual('password123');
    expect(user.rendaMensalUsuario).toEqual(5000);
    expect(user.rgUsuario).toEqual('1234567');
    expect(user.cpfUsuario).toEqual('12345678901');
  });

  it('should validate user entity', () => {
    const user = new User();
    user.id = 1;
    user.nomeUsuario = 'John Doe';
    user.emailUsuario = 'invalid-email';

    
  });
});
