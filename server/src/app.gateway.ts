import {
	Logger
} from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenPayload } from './modules/auth/dto/token-payload.dto';

@WebSocketGateway(3006, {
	cors: {
		origin: String(process.env.CLIENT_URL),
		credentials: true
	},
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server
	private readonly appLogger = new Logger(AppGateway.name)
	// Lưu trữ các client đang kết nối: Map<userId, socketId>
	public connectedUsers: Map<string, string> = new Map();

	constructor(
		private readonly tokenService: TokenService,
	) { }

	afterInit(server: Server) {
		this.appLogger.debug('WebSocket Gateway Initialized');

		server.use(async (socket: Socket, next) => {
			try {
				// Extract token from handshake
				const token = socket.handshake.auth?.token;
				if (!token) {
					return next(new Error('Authentication error: Token not provided.'));
				}

				const payload: TokenPayload = await this.tokenService.verifyToken(token);
				if (!payload) {
					return next(new Error('Authentication error: User not found.'));
				}

				// IMPORTANT: Attach user to the socket object
				socket.data.user = payload;
				next(); // Allow connection
			} catch (error) {
				this.appLogger.error(`Socket Middleware Auth Error: ${error.message}`);
				next(new Error('Authentication error')); // Reject connection
			}
		});
	}

	// Xử lý khi client kết nối
	handleConnection(client: Socket) {
		try {
			const user: TokenPayload = client.data.user;
			this.connectedUsers.set(user.sub, client.id);
			this.appLogger.debug(`Client @${user.sub} connected with io: ${client.id}`);
		} catch (error) {
			this.appLogger.error(`Connection failed: ${error.message}`);
			client.disconnect();
		}
	}

	// Xử lý khi client ngắt kết nối
	handleDisconnect(client: Socket) {
		const user: TokenPayload = client.data.user;
		if (user && user.sub) {
			this.connectedUsers.delete(user.sub);
			this.appLogger.debug(`Client disconnected: ${client.id}, User ID: ${user.sub}`);
		}
	}
}
