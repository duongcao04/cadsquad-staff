import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { TokenPayload } from './dto/token-payload.dto'
import { TokenService } from './token.service'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Get token from header
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        // 2. Validate token
        if (!token) {
            throw new UnauthorizedException('Certificate is invalid')
        }

        try {
            const payload: TokenPayload =
                await this.tokenService.verifyToken(token)

            // 2. Truy vấn Database để kiểm tra trạng thái isActive
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub }, // payload.sub thường chứa userId
                select: {
                    id: true,
                    email: true,
                    isActive: true,
                    role: { include: { permissions: true } },
                },
            })

            // 3. Kiểm tra user tồn tại và đang hoạt động
            if (!user) {
                throw new UnauthorizedException('User no longer exists')
            }

            if (!user.isActive) {
                // Trả về 403 Forbidden để Frontend biết tài khoản bị khóa (không phải lỗi token)
                throw new ForbiddenException(
                    'Your account has been deactivated'
                )
            }
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload
        } catch {
            throw new UnauthorizedException('Certificate is invalid')
        }

        // 3. All ok -> pass guard
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
