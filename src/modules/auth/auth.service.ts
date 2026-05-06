import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../../core/database/prisma.service.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(createAuthDto: RegisterDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (existingUser) throw new ConflictException('User already exists');
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 12);
    const newUser = await this.db.user.create({
      data: {
        email: createAuthDto.email,
        name: createAuthDto.name,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    const token = await this.jwt.signAsync({ userId: newUser.id });
    return token;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
