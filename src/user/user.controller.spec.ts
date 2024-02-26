import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    createUser: jest.fn(),
    doLogin: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
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

      const expectedResult = {
        statusCode: 201,
        message: 'CREATE_SUCCESS',
      };

      // then
      expect(result).toEqual(expectedResult);
      expect(spyCreateUserFn).toHaveBeenCalledTimes(1);
      expect(spyCreateUserFn).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('doLogin()', () => {
    const mockToken = 'token';
    const loginDto = {
      email: 'test@test.com',
      password: 'test1234',
    };

    it('SUCCESS: UserService의 doLogin()를 정상적으로 호출한다.', async () => {
      // given
      const spyDoLoginFn = jest.spyOn(mockUserService, 'doLogin');
      spyDoLoginFn.mockResolvedValueOnce(mockToken);

      // when
      const result = await userController.doLogin(loginDto);

      const expectedResult = {
        statusCode: 200,
        message: 'LOGIN_SUCCESS',
        data: mockToken,
      };

      // then
      expect(result).toEqual(expectedResult);
      expect(spyDoLoginFn).toHaveBeenCalledTimes(1);
      expect(spyDoLoginFn).toHaveBeenCalledWith(loginDto);
    });
  });
});
