import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../core/database/prisma.service.js';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}
  async getUserInfo(userId: string) {
    const userInfo = await this.db.user.findUnique({
      where: { id: userId },
      include: { posts: true },
    });
    if (!userInfo) throw new NotFoundException('User not found');
    const { password, ...safeUser } = userInfo;
    return safeUser;
  }

  async updateUserInfo(userId: string, userInfo: UpdateUserDto) {
    const findUser = await this.db.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (userInfo.email) {
      const existingNewEmail = await this.db.user.findUnique({
        where: { email: userInfo.email },
      });
      if (existingNewEmail && existingNewEmail.id !== userId) {
        throw new ConflictException(
          'The new email already used by another user',
        );
      }
    }
    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
    }
    const updatedUserInfo = await this.db.user.update({
      where: { id: userId },
      data: userInfo,
    });
    const { password, ...safeUser } = updatedUserInfo;
    return safeUser;
  }
}
