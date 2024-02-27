import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorator/get-user.decorator';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { CreatePostDto } from './dto/create-post.dto';
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
}
