import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUserInfo(@Req() req: Request) {
    const { userId, email } = req['userData'];
    return await this.usersService.getUserInfo(userId);
  }

  @Put('update')
  update(@Req() req: Request, @Body() userInfo: UpdateUserDto) {
    const { userId, email } = req['userData'];
    return this.usersService.updateUserInfo(userId, userInfo);
  }
}
