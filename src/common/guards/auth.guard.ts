import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      token = request.cookies.token;
    }
    if (!token) {
      throw new ForbiddenException('Token not found');
    }
    try {
      const { userId, email } = await this.jwtService.verifyAsync(
        token.accessToken || token,
      );
      request.userData = { userId, email };

      return true;
    } catch (error) {
      throw new ForbiddenException('Token invalid');
    }
  }
}
