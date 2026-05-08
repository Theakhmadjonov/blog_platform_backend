import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post/:postId')
  async create(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const { userId } = req['userData'];
    return await this.commentService.create(userId, postId, dto);
  }

  @Get('post/:postId')
  async getPostComments(@Param('postId') postId: string) {
    return await this.commentService.getPostComments(postId);
  }

  @Delete(':commentId')
  async delete(@Req() req: Request, @Param('commentId') commentId: string) {
    const { userId } = req['userData'];
    return await this.commentService.delete(userId, commentId);
  }
}
