import { Post } from '@prisma/client';

export class PostDetailResponse {
  id: number;

  title: string;

  content: string;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
  }
}
