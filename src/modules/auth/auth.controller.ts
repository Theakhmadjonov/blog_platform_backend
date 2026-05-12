import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createAuthDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(createAuthDto);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });
    return { token };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('login keldi');
    const token = await this.authService.login(loginDto);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });
    return { token };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const { id, role } = req['userId'];
    return await this.authService.getMe(id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return {
      message: 'Logged out successfully',
    };
  }
}
