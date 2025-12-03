import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client'
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateActivityLogDto {
	@ApiProperty({ description: 'ID of the job associated with the activity log', example: 'job-id-123' })
	@IsString()
	@IsNotEmpty()
	jobId: string

	@ApiProperty({ description: 'Previous value of the field being modified', required: false })
	@IsOptional()
	@IsString()
	previousValue?: string

	@ApiProperty({ description: 'Current value of the field being modified', required: false })
	@IsOptional()
	@IsString()
	currentValue?: string

	@ApiProperty({ description: 'ID of the user who modified the field', example: 'user-id-456' })
	@IsString()
	@IsNotEmpty()
	modifiedById: string

	@ApiProperty({ description: 'Name of the field that was modified', example: 'status' })
	@IsString()
	@IsNotEmpty()
	fieldName: string

	@ApiProperty({ description: 'Type of activity', enum: ActivityType, example: ActivityType.UpdateInformation })
	@IsString()
	@IsNotEmpty()
	activityType: ActivityType

	@ApiProperty({ description: 'Additional notes about the activity', required: false })
	@IsOptional()
	@IsString()
	notes?: string
}
