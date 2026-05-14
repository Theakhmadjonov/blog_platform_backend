import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
    private user: UsersService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await this.db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });
    const token = await this.jwt.signAsync({
      userId: newUser.id,
      email: newUser.email,
    });
    return {
      accessToken: token,
    };
  }

  async login(data: LoginDto) {
    const existingUser = await this.user.existUser(undefined, data.email);
    if (!existingUser)
      throw new ForbiddenException('Email or password is incorrect');
    const comparePassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!comparePassword)
      throw new ForbiddenException('Email or password is incorrect');
    const token = await this.jwt.signAsync({
      userId: existingUser.id,
      email: existingUser.email,
    });
    const userData = { email: existingUser.email, name: existingUser.name, id: existingUser.id };
    return {
      token,
      userData
    };
  }

  async getMe(userId: string) {
    console.log(userId);
    const findUSer = await this.db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
        id: true,
        email: true,
        posts: true,
      },
    });
    if (!findUSer) throw new NotFoundException('User not found');
    return findUSer;
  }
}
