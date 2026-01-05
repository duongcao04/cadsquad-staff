import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserService } from '../user/user.service'
import { PrismaService } from '../../providers/prisma/prisma.service'

@Injectable()
export class TokenService {
    private expiresIn: number
    private secretKey: string
    constructor(
        private readonly jwtService: JwtService,
        private readonly PrismaService: PrismaService
    ) {
        this.expiresIn = Number(process.env.JWT_EXPIRES_AT)
        this.secretKey = String(process.env.JWT_SECRET_KEY)
    }

    async signToken(user: User) {
        const getUser = await this.PrismaService.user.findUnique({
            where: { id: user.id },
            include: {
                role: {
                    include: {
                        permissions: true,
                    },
                },
            },
        })
        const role = getUser?.role?.code
        const userPermissions = getUser?.role?.permissions.map(
            (item) => item.entityAction
        )
        const payload = {
            sub: user.id,
            email: user.email,
            role,
            permissions: userPermissions,
            iat: Date.now(),
        }
        console.log(payload)

        try {
            const token = await this.jwtService.signAsync(payload)
            return token
        } catch (error) {
            console.log(error)
        }
    }

    async verifyToken(token: string) {
        // 1. Verify token
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.secretKey,
        })
        // 2. Check token expired
        const isExpired = await this.isTokenExpired(payload.exp)
        if (isExpired) {
            throw new UnauthorizedException('Token expired')
        }
        // 3. Return token payload
        return payload
    }

    async isTokenExpired(exp: number) {
        return new Date(exp).getTime() < new Date().getTime()
    }

    async getAccessToken(user: User) {
        const accessToken = await this.signToken(user)
        return {
            token: accessToken,
            expiresAt: Date.now() + this.expiresIn,
        }
    }
}
