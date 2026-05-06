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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createAuthDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(createAuthDto);
    console.log(token); 
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });
    return { token };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
