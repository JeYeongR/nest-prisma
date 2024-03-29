import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDetailResponse } from './dto/post-detail-response.dto';
import { PostResponse } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(user: User, createPostDto: CreatePostDto): Promise<void> {
    const foundCategory = await this.prisma.category.findFirst({
      where: {
        name: createPostDto.category,
      },
    });
    if (!foundCategory) {
      throw new NotFoundException('NOT_FOUND_CATEGORY');
    }

    await this.prisma.post.create({
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
            id: foundCategory.id,
          },
        },
      },
    });
  }

  async getPostsAll(): Promise<PostResponse[]> {
    const foundPosts = await this.prisma.post.findMany({
      where: {
        published: true,
      },
    });

    return foundPosts.map((foundPost) => new PostResponse(foundPost));
  }

  async getPost(postId: number): Promise<PostDetailResponse> {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!foundPost) {
      throw new NotFoundException('NOT_FOUND_POST');
    }

    return new PostDetailResponse(foundPost);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!foundPost) {
      throw new NotFoundException('NOT_FOUND_POST');
    }

    await this.prisma.post.update({
      where: {
        userId: userId,
        id: foundPost.id,
      },
      data: updatePostDto,
    });
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!foundPost) {
      throw new NotFoundException('NOT_FOUND_POST');
    }

    await this.prisma.post.delete({
      where: {
        userId: userId,
        id: foundPost.id,
      },
    });
  }
}
