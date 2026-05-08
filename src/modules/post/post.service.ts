import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private user: UsersService,
    private db: PrismaService,
  ) {}
  async create(userId: string, postData: CreatePostDto) {
    await this.user.existUser(userId);
    const newPost = await this.db.post.create({
      data: {
        authorId: userId,
        ...postData,
      },
    });
    if (!newPost) throw new InternalServerErrorException();
    return newPost;
  }

  async findAllUserPosts(userId: string) {
    await this.user.existUser(userId);
    const posts = await this.db.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        comments: true,
        likes: true,
        _count: true,
      },
    });
    return posts;
  }

  async findAllPosts() {
    const posts = await this.db.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
        comments: true,
        likes: true,
        _count: true,
      },
    });
    return posts;
  }

  async getPost(postId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            comments: true,
            createdAt: true,
            email: true,
            likes: true,
            name: true,
            id: true,
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private async checkOwnership(userId: string, postId: string) {
    const post = await this.getPost(postId);
    if (post.author.id !== userId) {
      throw new ForbiddenException('You are not owner of this post');
    }
    return post;
  }

  async publishPost(userId: string, postId: string) {
    await this.checkOwnership(userId, postId);
    const updatedPost = await this.db.post.update({
      where: { id: postId },
      data: { published: true },
    });
    return updatedPost;
  }

  async updatePost(userId: string, postId: string, data: UpdatePostDto) {
    await this.checkOwnership(userId, postId);
    const updatedPost = await this.db.post.update({
      where: { id: postId },
      data: { ...data },
    });
    return updatedPost;
  }

  async removePost(userId: string, postId: string) {
    await this.checkOwnership(userId, postId);
    await this.db.post.delete({ where: { id: postId } });
    return 'Post successfully deleted';
  }
}
