import { User } from './user.entity';

describe('User', () => {
  it('Deve criar um novo usuario', () => {
    const user = new User();
    user.id = 1;
    user.nomeUsuario = 'João';
    user.emailUsuario = 'joao@example.com';

    expect(user.id).toBe(1);
    expect(user.nomeUsuario).toBe('João');
    expect(user.emailUsuario).toBe('joao@example.com');
  });
});
