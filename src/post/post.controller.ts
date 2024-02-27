import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorator/get-user.decorator';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDetailResponse } from './dto/post-detail-response.dto';
import { PostResponse } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @GetUser() user: User,
    @Body() createPostDto: CreatePostDto,
  ): Promise<CommonResponseDto<void>> {
    await this.postService.createPost(user, createPostDto);

    return CommonResponseDto.success(ResponseMessage.CREATE_SUCCESS);
  }

  @Get()
  @IsPublic()
  async getPostsAll(): Promise<CommonResponseDto<PostResponse[]>> {
    const result = await this.postService.getPostsAll();

    return CommonResponseDto.success<PostResponse[]>(
      ResponseMessage.READ_SUCCESS,
    ).setData(result);
  }

  @Get('/:postId')
  @IsPublic()
  async getPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommonResponseDto<PostDetailResponse>> {
    const result = await this.postService.getPost(postId);

    return CommonResponseDto.success<PostDetailResponse>(
      ResponseMessage.READ_SUCCESS,
    ).setData(result);
  }

  @Patch('/:postId')
  async updatePost(
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CommonResponseDto<void>> {
    await this.postService.updatePost(user.id, postId, updatePostDto);

    return CommonResponseDto.success(ResponseMessage.UPDATE_SUCCESS);
  }

  @Delete('/:postId')
  async deletePost(
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommonResponseDto<void>> {
    await this.postService.deletePost(user.id, postId);

    return CommonResponseDto.success(ResponseMessage.DELETE_SUCCESS);
  }
}
