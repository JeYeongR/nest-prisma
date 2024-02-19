import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser()', () => {
    const mockPassword = 'test1234';
    const createUserDto = {
      email: 'test@test.com',
      name: 'test',
      password: mockPassword,
    };
    const mockHashedPassword = 'sdadasfgaaegt';

    it('SUCCESS: 성공적으로 유저를 생성한다.', async () => {
      // given
      const spyPrismaUserCreateFn = jest.spyOn(mockPrisma.user, 'create');
      const spyBcryptHash = jest.spyOn(bcrypt, 'hash');
      spyBcryptHash.mockImplementation(() => mockHashedPassword);

      // when
      const result = await userService.createUser(createUserDto);

      // then
      expect(result).toBeUndefined();
      expect(spyPrismaUserCreateFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaUserCreateFn).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: mockHashedPassword,
        },
      });
      expect(spyBcryptHash).toHaveBeenCalledTimes(1);
      expect(spyBcryptHash).toHaveBeenCalledWith(mockPassword, 10);
    });
  });
});
