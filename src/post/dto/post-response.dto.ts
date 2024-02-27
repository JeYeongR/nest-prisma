import { Post } from '@prisma/client';

export class PostResponse {
  id: number;

  title: string;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
  }
}
