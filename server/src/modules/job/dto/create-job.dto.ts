import {
	IsUUID,
	IsString,
	IsOptional,
	IsNotEmpty,
	IsInt,
	IsBoolean,
	IsUrl,
	IsDateString,
	Matches,
	IsArray,
} from 'class-validator'

export class CreateJobDto {
	@IsString()
	@IsNotEmpty()
	no: string

	@IsUUID()
	typeId: string

	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	attachmentUrls?: string

	@IsString()
	@IsNotEmpty()
	clientName: string

	@IsInt()
	incomeCost: number

	@IsInt()
	staffCost: number

	@IsOptional()
	@IsArray()
	assigneeIds?: string[]

	@IsUUID()
	createdById: string

	@IsUUID()
	paymentChannelId: string

	@IsUUID()
	statusId: string

	@IsOptional()
	@IsDateString()
	startedAt?: Date

	@IsOptional()
	@IsString()
	priority?: string // Could be validated against an enum (LOW, MEDIUM, HIGH)

	@IsOptional()
	@IsBoolean()
	isPinned?: boolean

	@IsOptional()
	@IsBoolean()
	isPublished?: boolean

	@IsOptional()
	@IsBoolean()
	isPaid?: boolean

	@IsDateString()
	dueAt: Date

	@IsOptional()
	@IsDateString()
	completedAt?: Date

	@IsOptional()
	@IsDateString()
	deletedAt?: Date
}
