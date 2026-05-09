import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LikeService } from './like.service';

@Controller('like')
@UseGuards(AuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  async likePost(
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    const { userId } = req['userData'];
    return await this.likeService.likePost(userId, postId);
  }

  @Delete(':postId')
  async unlikePost(
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    const { userId } = req['userData'];
    return await this.likeService.unlikePost(userId, postId);
  }
}
