import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

// TODO: Post 만들기
@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
