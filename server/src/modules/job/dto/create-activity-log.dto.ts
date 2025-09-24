import { ActivityType } from '@prisma/client'
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateActivityLogDto {
	@IsString()
	@IsNotEmpty()
	jobId: string

	@IsOptional()
	@IsString()
	previousValue?: string

	@IsOptional()
	@IsString()
	currentValue?: string

	@IsString()
	@IsNotEmpty()
	modifiedById: string

	@IsString()
	@IsNotEmpty()
	fieldName: string

	@IsString()
	@IsNotEmpty()
	activityType: ActivityType

	@IsOptional()
	@IsString()
	notes?: string
}
