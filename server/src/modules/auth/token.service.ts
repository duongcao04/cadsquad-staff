import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
	private expiresIn: number
	private secretKey: string
	constructor(
		private jwtService: JwtService
	) {
		this.expiresIn = Number(process.env.JWT_EXPIRES_AT)
		this.secretKey = String(process.env.JWT_SECRET_KEY)
	}

	async signToken(user: User) {
		const payload = { sub: user.id, email: user.email, role: user.role, iat: Date.now() };
		try {
			const token = await this.jwtService.signAsync(payload)
			return token
		} catch (error) {
			console.log(error);
		}
	}

	async verifyToken(token: string) {
		// 1. Verify token
		const payload = await this.jwtService.verifyAsync(
			token,
			{
				secret: this.secretKey
			}
		);
		// 2. Check token expired
		const isExpired = await this.isTokenExpired(payload.exp)
		if (isExpired) {
			throw new UnauthorizedException('Token expired');
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
			expiresAt: Date.now() + this.expiresIn
		}
	}
}