import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Ably from 'ably';

@Injectable()
export class AblyService implements OnModuleInit {
	private client: Ably.Rest;

	onModuleInit() {
		// Khởi tạo Ably REST client khi module được load
		// REST phù hợp cho server-side publishing
		this.client = new Ably.Rest(String(process.env.ABLY_API_KEY));
	}

	async createTokenRequest(userId: string) {
		const tokenRequestData = await this.client.auth.createTokenRequest({
			// clientId là định danh người dùng.
			// Nếu app có login, hãy truyền User ID vào đây.
			// Nếu là public, có thể để string ngẫu nhiên hoặc cố định.
			clientId: userId,
		});

		return tokenRequestData;
	}

	/**
	 * Gửi tin nhắn (Publish) lên một kênh (Channel)
	 * @param channelName Tên kênh (ví dụ: 'orders', 'notifications')
	 * @param eventName Tên sự kiện (ví dụ: 'created', 'reload')
	 * @param data Dữ liệu đính kèm (Object, String, etc.)
	 */
	async publish(channelName: string, eventName: string, data: any) {
		const channel = this.client.channels.get(channelName);

		try {
			await channel.publish(eventName, data);
			console.log(`[Ably] Published to ${channelName}: ${eventName}`);
		} catch (error) {
			console.error('[Ably] Publish failed:', error);
			throw error;
		}
	}
}