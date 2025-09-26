import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private tokenService: TokenService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // 1. Get token from header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // 2. Validate token
    if (!token) {
      throw new UnauthorizedException('Certificate is invalid');
    }

    try {
      const payload = await this.tokenService.verifyToken(
        token
      );

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Certificate is invalid');
    }

    // 3. All ok -> pass guard
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
