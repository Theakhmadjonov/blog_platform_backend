import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    if (existingLike) {
      throw new BadRequestException('You already liked this post');
    }
    await this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    return {
      message: 'Post liked successfully',
    };
  }

  async unlikePost(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }
    await this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return {
      message: 'Like removed successfully',
    };
  }
}
