import { Expose } from 'class-transformer'
import { NotificationType } from '@prisma/client'

export class NotificationResponseDto {
	@Expose()
	id: string

	@Expose()
	title?: string

	@Expose()
	content: string

	@Expose()
	imageUrl?: string

	@Expose()
	senderId?: string

	@Expose()
	status: string

	@Expose()
	type: NotificationType

	@Expose()
	userId: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
