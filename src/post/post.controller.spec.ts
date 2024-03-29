import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { Category } from './dto/post-category.enum';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;

  const mockPostService = {
    createPost: jest.fn(),
    getPostsAll: jest.fn(),
    getPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
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

      const expectedResult = {
        statusCode: 201,
        message: 'CREATE_SUCCESS',
      };

      // when
      const result = await postController.createPost(
        user as User,
        createPostDto,
      );

      // then
      expect(result).toEqual(expectedResult);
      expect(spyCreatePostFn).toHaveBeenCalledTimes(1);
      expect(spyCreatePostFn).toHaveBeenCalledWith(user as User, createPostDto);
    });
  });

  describe('getPostsAll()', () => {
    const mockPostResponses = [
      {
        id: 1,
        title: 'test',
      },
    ];

    it('SUCCESS: PostService의 getPostsAll()를 정상적으로 호출한다.', async () => {
      // given
      const spyGetPostsAllFn = jest.spyOn(mockPostService, 'getPostsAll');
      spyGetPostsAllFn.mockResolvedValueOnce(mockPostResponses);

      const expectedResult = {
        statusCode: 200,
        message: 'READ_SUCCESS',
        data: mockPostResponses,
      };

      // when
      const result = await postController.getPostsAll();

      // then
      expect(result).toEqual(expectedResult);
      expect(spyGetPostsAllFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPost()', () => {
    const postId = 1;
    const mockPostDetailResponse = {
      id: 1,
      title: 'test',
      content: 'testtest',
    };

    it('SUCCESS: PostService의 getPost()를 정상적으로 호출한다.', async () => {
      // given
      const spyGetPostFn = jest.spyOn(mockPostService, 'getPost');
      spyGetPostFn.mockResolvedValueOnce(mockPostDetailResponse);

      const expectedResult = {
        statusCode: 200,
        message: 'READ_SUCCESS',
        data: mockPostDetailResponse,
      };

      // when
      const result = await postController.getPost(postId);

      // then
      expect(result).toEqual(expectedResult);
      expect(spyGetPostFn).toHaveBeenCalledTimes(1);
      expect(spyGetPostFn).toHaveBeenCalledWith(postId);
    });
  });

  describe('updatePost()', () => {
    const user = {
      id: 1,
    };
    const postId = 1;
    const updatePostDto = {
      title: 'test2',
      content: 'testtest2',
    };

    it('SUCCESS: PostService의 updatePost()를 정상적으로 호출한다.', async () => {
      // given
      const spyUpdatePostFn = jest.spyOn(mockPostService, 'updatePost');

      const expectedResult = {
        statusCode: 200,
        message: 'UPDATE_SUCCESS',
      };

      // when
      const result = await postController.updatePost(
        user as User,
        postId,
        updatePostDto,
      );

      // then
      expect(result).toEqual(expectedResult);
      expect(spyUpdatePostFn).toHaveBeenCalledTimes(1);
      expect(spyUpdatePostFn).toHaveBeenCalledWith(
        user.id,
        postId,
        updatePostDto,
      );
    });
  });

  describe('deletePost()', () => {
    const user = {
      id: 1,
    };
    const postId = 1;

    it('SUCCESS: PostService의 deletePost()를 정상적으로 호출한다.', async () => {
      // given
      const spyDeletePostFn = jest.spyOn(mockPostService, 'deletePost');

      const expectedResult = {
        statusCode: 200,
        message: 'DELETE_SUCCESS',
      };

      // when
      const result = await postController.deletePost(user as User, postId);

      // then
      expect(result).toEqual(expectedResult);
      expect(spyDeletePostFn).toHaveBeenCalledTimes(1);
      expect(spyDeletePostFn).toHaveBeenCalledWith(user.id, postId);
    });
  });
});
