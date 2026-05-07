import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const handlerClass = context.getClass();
    const isFreeAuthClass = this.reflector.get('isFreeAuth', handlerClass);
    const isFreeAuth = this.reflector.get('isFreeAuth', handler);
    const isPublic = this.reflector.getAllAndOverride<boolean>('isFreeAuth', [
      handler,
      handlerClass,
    ]);
    if (isPublic) return true;
    let token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      token = request.cookies?.token;
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
