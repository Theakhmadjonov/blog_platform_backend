import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto.js';

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
    const token = await this.authService.login(loginDto);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });
    return { token };
  }
}
