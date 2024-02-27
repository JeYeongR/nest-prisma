import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { Category } from './dto/post-category.enum';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;

  const mockPostService = {
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
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

    it('SUCCESS: PostService의 createPost()를 정상적으로 호출한다.', async () => {
      // given
      const spyCreatePostFn = jest.spyOn(mockPostService, 'createPost');

      // when
      const result = await postController.createPost(
        user as User,
        createPostDto,
      );

      const expectedResult = {
        statusCode: 201,
        message: 'CREATE_SUCCESS',
      };

      // then
      expect(result).toEqual(expectedResult);
      expect(spyCreatePostFn).toHaveBeenCalledTimes(1);
      expect(spyCreatePostFn).toHaveBeenCalledWith(user as User, createPostDto);
    });
  });
});
