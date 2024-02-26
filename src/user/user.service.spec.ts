import {
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('doLogin()', () => {
    const loginDto = {
      email: 'test@test.com',
      password: 'test1234',
    };
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'sdadasfgaaegt',
    };
    const mockToken = 'token';

    it('SUCCESS: 성공적으로 로그인한다.', async () => {
      // given
      const spyPrismaUserFindUniqueFn = jest.spyOn(
        mockPrisma.user,
        'findUnique',
      );
      spyPrismaUserFindUniqueFn.mockResolvedValueOnce(mockUser);
      const spyBcryptCompare = jest.spyOn(bcrypt, 'compare');
      spyBcryptCompare.mockImplementation(() => true);
      const spyJwtSignFn = jest.spyOn(mockJwtService, 'sign');
      spyJwtSignFn.mockReturnValueOnce(mockToken);

      const expectedResult = {
        accessToken: mockToken,
      };

      // when
      const result = await userService.doLogin(loginDto);

      // then
      expect(result).toEqual(expectedResult);
      expect(spyPrismaUserFindUniqueFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaUserFindUniqueFn).toHaveBeenCalledWith({
        where: {
          email: loginDto.email,
        },
      });
      expect(spyBcryptCompare).toHaveBeenCalledTimes(1);
      expect(spyBcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(spyJwtSignFn).toHaveBeenCalledTimes(1);
      expect(spyJwtSignFn).toHaveBeenCalledWith(
        { sub: mockUser.id },
        { expiresIn: '1h' },
      );
    });

    it('FAILURE: 유저를 찾을 수 없으면 Not Found Exception을 반환한다.', async () => {
      // given
      const spyPrismaUserFindUniqueFn = jest.spyOn(
        mockPrisma.user,
        'findUnique',
      );
      spyPrismaUserFindUniqueFn.mockResolvedValueOnce(null);

      // when
      let hasThrown = false;
      try {
        await userService.doLogin(loginDto);

        // Then
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          error: 'Not Found',
          message: 'NOT_FOUND_USER',
          statusCode: 404,
        });
      }
      expect(hasThrown).toBeTruthy();
    });

    it('FAILURE: 암호가 틀리면 Unauthorized Exception을 반환한다.', async () => {
      // given
      const spyPrismaUserFindUniqueFn = jest.spyOn(
        mockPrisma.user,
        'findUnique',
      );
      spyPrismaUserFindUniqueFn.mockResolvedValueOnce(mockUser);
      const spyBcryptCompare = jest.spyOn(bcrypt, 'compare');
      spyBcryptCompare.mockImplementation(() => false);

      // when
      let hasThrown = false;
      try {
        await userService.doLogin(loginDto);

        // Then
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
        expect(error.getResponse()).toEqual({
          error: 'Unauthorized',
          message: 'INVALID_PASSWORD',
          statusCode: 401,
        });
      }
      expect(hasThrown).toBeTruthy();
    });
  });

  describe('findOneById()', () => {
    const id = 1;
    const mockUser = {
      id,
      email: 'test@test.com',
      password: 'sdadasfgaaegt',
    };

    it('SUCCESS: 성공적으로 유저를 조회한다.', async () => {
      // given
      const spyPrismaUserFindUniqueFn = jest.spyOn(
        mockPrisma.user,
        'findUnique',
      );
      spyPrismaUserFindUniqueFn.mockResolvedValueOnce(mockUser);

      // when
      const result = await userService.findOneById(id);

      // then
      expect(result).toEqual(mockUser);
      expect(spyPrismaUserFindUniqueFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaUserFindUniqueFn).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
    });
  });
});
