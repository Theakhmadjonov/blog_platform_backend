import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [PostController],
  providers: [PostService, UsersService],
})
export class PostModule {}
