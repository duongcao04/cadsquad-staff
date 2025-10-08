import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(private tokenService: TokenService) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: Socket = context.switchToWs().getClient<Socket>();
		const token = this.extractTokenFromHandshake(client);

		if (!token) {
			throw new WsException('Unauthorized: No token provided');
		}

		try {
			const payload = await this.tokenService.verifyToken(token);
			client.data.user = payload; // Attach user payload to the socket
		} catch (e) {
			throw new WsException('Unauthorized: Invalid token');
		}
		return true;
	}

	private extractTokenFromHandshake(client: Socket): string | undefined {
		const authToken = client.handshake.headers.authorization;
		if (authToken && authToken.startsWith('Bearer ')) {
			return authToken.substring(7);
		}
		return undefined;
	}
}
