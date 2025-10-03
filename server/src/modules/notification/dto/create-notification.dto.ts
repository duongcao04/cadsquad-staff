import { IsOptional, IsString, IsEnum } from 'class-validator'
import { NotificationType } from '@prisma/client'

export class CreateNotificationDto {
	@IsOptional()
	@IsString()
	title?: string

	@IsString()
	content: string

	@IsOptional()
	@IsString()
	imageUrl?: string

	@IsOptional()
	@IsString()
	senderId?: string

	@IsOptional()
	@IsString()
	redirectUrl?: string

	@IsEnum(NotificationType)
	type: NotificationType

	@IsString()
	userId: string
}
