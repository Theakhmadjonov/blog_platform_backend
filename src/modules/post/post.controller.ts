import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import type { Request } from 'express';
import { FreeAuth } from '../../common/decorators/free-auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Req() req: Request, @Body() postData: CreatePostDto) {
    const { userId, email } = req['userData'];
    return await this.postService.create(userId, postData);
  }

  @Get('user')
  async findAllUserPosts(@Req() req: Request) {
    const { userId, email } = req['userData'];
    return await this.postService.findAllUserPosts(userId);
  }

  @Get('all')
  @FreeAuth()
  async findAllPosts() {
    return await this.postService.findAllPosts();
  }

  @Get(':postId')
  @FreeAuth()
  async getPost(@Param('postId') postId: string) {
    return await this.postService.getPost(postId);
  }

  @Put('publish/:postId')
  async publishPost(@Req() req: Request, @Param('postId') postId: string) {
    const { userId, email } = req['userData'];
    return await this.postService.publishPost(userId, postId);
  }

  @Put(':postId')
  async updatePost(
    @Req() req: Request,
    @Body() data: UpdatePostDto,
    @Param('postId') postId: string,
  ) {
    const { userId, email } = req['userData'];
    return await this.postService.updatePost(userId, postId, data);
  }

  @Delete(':postId')
  async removePost(@Req() req: Request, @Param('postId') postId: string) {
    const { userId, email } = req['userData'];
    return await this.postService.removePost(userId, postId);
  }
}
