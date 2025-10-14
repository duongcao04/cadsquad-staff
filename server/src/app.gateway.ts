import { BadRequestException, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { TokenPayload } from "./modules/auth/dto/token-payload.dto";
import { TokenService } from "./modules/auth/token.service";
import { UserService } from "./modules/user/user.service";

@WebSocketGateway(3006, { cors: true })
export class AppGateway {
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('MessageGateway');

	constructor(
		private userService: UserService,
		private tokenService: TokenService,
	) { }

	async handleConnection(client: Socket) {
		this.logger.log(client.id, 'Connected..............................');
		const user = await this.getDataUserFromToken(client);

		if (!user) {
			throw new BadRequestException("User not found. Is a bad request!")
		}

		const device = {
			user_id: user.id,
			type: client.id,
			status: false,
			value: client.id,
		};

		await this.deviceService.create(information);
	}

	//function get user from token
	private async getDataUserFromToken(client: Socket) {
		const authToken: any = client.handshake?.query?.token;
		try {
			const decoded: TokenPayload = await this.tokenService.verifyToken(authToken);

			return await this.userService.findById(decoded.sub); // response to function
		} catch (ex) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}
}

