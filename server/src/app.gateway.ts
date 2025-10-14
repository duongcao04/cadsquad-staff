import {
	BadRequestException,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { TokenPayload } from "./modules/auth/dto/token-payload.dto";
import { TokenService } from "./modules/auth/token.service";
import { UserDevicesService } from "./modules/user-devices/user-devices.service";
import { UserService } from "./modules/user/user.service";
import { User } from "@prisma/client";

@WebSocketGateway(3006, { cors: true })
export class AppGateway {
	@WebSocketServer() server: Server;
	private readonly logger = new Logger("AppGateway");

	constructor(
		private readonly userService: UserService,
		private readonly userDevicesService: UserDevicesService,
		private readonly tokenService: TokenService,
	) { }

	async handleConnection(client: Socket) {
		this.logger.log(`Socket connected: ${client.id}`);
		try {
			const user = await this.getDataUserFromToken(client);

			const existingUserDevices = await this.userDevicesService.findByUser(user.id);
			const deviceRecord = Array.isArray(existingUserDevices)
				? existingUserDevices[0]
				: existingUserDevices;

			if (!deviceRecord) {
				await this.userDevicesService.create({
					userId: user.id,
					type: "website",
					status: true,
					values: [client.id],
				});
				this.logger.log(`Created new device record for user ${user.username}`);
			} else {
				const updatedValues = Array.from(new Set([...deviceRecord.values, client.id]));
				await this.userDevicesService.update(deviceRecord.id, { values: updatedValues });
				this.logger.log(`Updated device record for user ${user.username}`);
			}
		} catch (error) {
			this.logger.error(`Connection error: ${error.message}`);
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		try {
			const user = await this.getDataUserFromToken(client);
			const existingUserDevices = await this.userDevicesService.findByUser(user.id);
			const deviceRecord = Array.isArray(existingUserDevices)
				? existingUserDevices[0]
				: existingUserDevices;

			if (!deviceRecord) {
				this.logger.warn(`Disconnect: No device record found for user ${user.id}`);
				return;
			}

			const updatedValues = deviceRecord.values.filter((id) => id !== client.id);
			await this.userDevicesService.update(deviceRecord.id, { values: updatedValues });
			this.logger.log(`Socket ${client.id} removed from user ${user.username}`);
		} catch (error) {
			this.logger.error(`Disconnect error: ${error.message}`);
		}
	}

	@SubscribeMessage("login")
	async handleLogin(
		@MessageBody() data: { token: string, deviceId: string },
		@ConnectedSocket() client: Socket,
	) {
		try {
			const decoded: TokenPayload = await this.tokenService.verifyToken(data.token);
			const user = await this.userService.findById(decoded.sub);
			if (!user) throw new NotFoundException("User not found");

			const existingUserDevices = await this.userDevicesService.findByUser(user.id);
			const deviceRecord = Array.isArray(existingUserDevices)
				? existingUserDevices[0]
				: existingUserDevices;

			if (!deviceRecord) {
				await this.userDevicesService.create({
					userId: user.id,
					type: "website",
					status: true,
					values: [client.id],
				});
			} else {
				const updatedValues = Array.from(new Set([...deviceRecord.values, client.id]));
				await this.userDevicesService.update(deviceRecord.id, { values: updatedValues });
			}

			client.emit("login-success", { message: "Socket registered successfully." });
			this.logger.log(`Login success for user: ${user.username}`);
		} catch (error) {
			this.logger.error(`Login failed: ${error.message}`);
			client.emit("login-error", { message: "Login failed or invalid token." });
			throw new InternalServerErrorException("Socket login failed");
		}
	}
	/** 
	 * Helper: Extract and verify user from token 
	 */
	private async getDataUserFromToken(client: Socket): Promise<User> {
		const authToken: string | undefined = client.handshake?.query?.token as string;

		if (!authToken) {
			throw new BadRequestException("Missing authentication token in socket handshake.");
		}

		try {
			const decoded: TokenPayload = await this.tokenService.verifyToken(authToken);
			const user = await this.userService.findById(decoded.sub);

			if (!user) {
				throw new NotFoundException("User not found");
			}

			return user;
		} catch (error) {
			if (error instanceof NotFoundException) throw error;
			this.logger.error(`Token verification failed: ${error.message}`);
			throw new UnauthorizedException("Invalid or expired token.");
		}
	}
}