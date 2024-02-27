import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './dto/post-category.enum';
import { PostService } from './post.service';

describe('PostService', () => {
  let postService: PostService;

  const mockPrisma = {
    category: {
      findFirst: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('createPost()', () => {
    const user = {
      id: 1,
    };
    const createPostDto = {
      title: 'test',
      content: 'testtest',
      published: null,
      category: Category.place,
    };
    const mockCategory = {
      id: 1,
      name: Category.place,
    };

    it('SUCCESS: 성공적으로 포스트를 생성한다.', async () => {
      // given
      const spyPrismaCategoryFindFirstFn = jest.spyOn(
        mockPrisma.category,
        'findFirst',
      );
      spyPrismaCategoryFindFirstFn.mockResolvedValueOnce(mockCategory);
      const spyPrismaPostCreateFn = jest.spyOn(mockPrisma.post, 'create');

      // when
      const result = await postService.createPost(user as User, createPostDto);

      // then
      expect(result).toBeUndefined();
      expect(spyPrismaCategoryFindFirstFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaCategoryFindFirstFn).toHaveBeenCalledWith({
        where: {
          name: createPostDto.category,
        },
      });
      expect(spyPrismaPostCreateFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaPostCreateFn).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          published: createPostDto.published,
          user: {
            connect: {
              id: user.id,
            },
          },
          category: {
            connect: {
              id: mockCategory.id,
            },
          },
        },
      });
    });

    it('FAILURE: 카테고리를 찾을 수 없으면 Not Found Exception을 반환한다.', async () => {
      // given
      const spyPrismaCategoryFindFirstFn = jest.spyOn(
        mockPrisma.category,
        'findFirst',
      );
      spyPrismaCategoryFindFirstFn.mockResolvedValueOnce(null);

      // when
      let hasThrown = false;
      try {
        await postService.createPost(user as User, createPostDto);

        // Then
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          error: 'Not Found',
          message: 'NOT_FOUND_CATEGORY',
          statusCode: 404,
        });
      }
      expect(hasThrown).toBeTruthy();
    });
  });

  describe('getPostsAll()', () => {
    const mockPosts = [
      {
        id: 1,
        title: 'test',
        content: 'testtest',
      },
    ];

    it('SUCCESS: 성공적으로 포스트를 전체 조회한다.', async () => {
      // given
      const spyPrismaPostFindManyFn = jest.spyOn(mockPrisma.post, 'findMany');
      spyPrismaPostFindManyFn.mockResolvedValueOnce(mockPosts);

      const expectedResult = [
        {
          id: mockPosts[0].id,
          title: mockPosts[0].title,
        },
      ];

      // when
      const result = await postService.getPostsAll();

      // then
      expect(result).toEqual(expectedResult);
      expect(spyPrismaPostFindManyFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaPostFindManyFn).toHaveBeenCalledWith({
        where: {
          published: true,
        },
      });
    });
  });

  describe('getPost()', () => {
    const postId = 1;
    const mockPost = {
      id: postId,
      title: 'test',
      content: 'testtest',
    };

    it('SUCCESS: 성공적으로 포스트를 상세 조회한다.', async () => {
      // given
      const spyPrismaPostFindFirstFn = jest.spyOn(mockPrisma.post, 'findFirst');
      spyPrismaPostFindFirstFn.mockResolvedValueOnce(mockPost);

      // when
      const result = await postService.getPost(postId);

      // then
      expect(result).toEqual(mockPost);
      expect(spyPrismaPostFindFirstFn).toHaveBeenCalledTimes(1);
      expect(spyPrismaPostFindFirstFn).toHaveBeenCalledWith({
        where: {
          id: postId,
        },
      });
    });
  });
});
