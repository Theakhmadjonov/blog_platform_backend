import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(data: RegisterDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new ConflictException('User already exists');
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await this.db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });
    const token = await this.jwt.signAsync({ userId: newUser.id });
    return token;
  }

  async login(data: LoginDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });
    if (!existingUser)
      throw new ForbiddenException('Email or password is incorrect');
    const comparePassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!comparePassword)
      throw new ForbiddenException('Email or password incorrect');
    const token = await this.jwt.signAsync({ userId: existingUser.id });
    return token;
  }
}
