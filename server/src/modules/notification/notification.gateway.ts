import { Logger, UseGuards } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AppGateway } from "../../app.gateway";
import { WsJwtGuard } from "../auth/ws-jwt.guard";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@WebSocketGateway(3006, {
	cors: {
		origin: '*', // Cho phép kết nối từ mọi nguồn, hãy cấu hình lại cho production
	},
})
export class NotificationGateway extends AppGateway {
	private readonly logger = new Logger(AppGateway.name)

	@UseGuards(WsJwtGuard) // Áp dụng Guard cho message handler này
	@SubscribeMessage('send_message')
	sendNotificationToUser(dto: CreateNotificationDto): void {
		const receiverSocketId = this.connectedUsers.get(dto.userId);

		if (receiverSocketId) {
			// Gửi sự kiện đến một client cụ thể thông qua socket id
			this.server.to(receiverSocketId).emit('received_message', dto);
			this.logger.debug(`Emitted 'received_message' to socket ID: ${receiverSocketId}`);
		} else {
			// Xử lý trường hợp người nhận không online
			this.logger.warn(
				`User ${dto.userId} is not connected. Message not sent.`,
			);
			// Bạn có thể lưu tin nhắn vào database ở đây để gửi lại sau
		}
	}
}