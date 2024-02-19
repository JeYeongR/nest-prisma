import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser()', () => {
    const createUserDto = {
      email: 'test@test.com',
      name: 'test',
      password: 'test1234',
    };

    it('SUCCESS: UserService의 createUser()를 정상적으로 호출한다.', async () => {
      // given
      const spyCreateUserFn = jest.spyOn(mockUserService, 'createUser');

      // when
      const result = await userController.createUser(createUserDto);

      // then
      expect(result).toBeUndefined();
      expect(spyCreateUserFn).toHaveBeenCalledTimes(1);
      expect(spyCreateUserFn).toHaveBeenCalledWith(createUserDto);
    });
  });
});
