import { Expose, Type } from 'class-transformer'

import { OmitType } from '@nestjs/swagger'
import { JobStatusResponseDto } from '../../job-status/dto/job-status-response.dto'
import { JobTypeResponseDto } from '../../job-type/dto/job-type-response.dto'
import { PaymentChannelResponseDto } from '../../payment-channel/dto/payment-channel-response.dto'
import { UserResponseDto } from '../../user/dto/user-response.dto'
import { CommentResponseDto } from '../../comment/dto/comment-response.dto'

export class JobResponseDto {
	@Expose()
	id: string

	@Expose()
	no: string

	@Expose()
	displayName: string

	@Expose()
	thumbnailUrl: string

	@Expose()
	description?: string

	@Expose()
	sourceUrl?: string

	@Expose()
	clientName: string

	@Expose()
	incomeCost: number

	@Expose()
	staffCost: number

	@Expose()
	isPinned: boolean

	@Expose()
	isPublished: boolean

	@Expose()
	isPaid: boolean

	@Expose()
	priority: string

	@Expose()
	attachmentUrls: string[]

	@Expose()
	startedAt: Date

	@Expose()
	dueAt: Date

	@Expose()
	completedAt?: Date

	@Expose()
	finishedAt?: Date

	@Expose()
	paidAt?: Date

	@Expose()
	deletedAt?: Date

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date

	@Expose()
	@Type(() => UserResponseDto)
	createdBy: UserResponseDto

	@Expose()
	@Type(() => CommentResponseDto)
	comments: CommentResponseDto

	@Expose()
	@Type(() => JobTypeResponseDto)
	type: JobTypeResponseDto

	@Expose()
	@Type(() => PaymentChannelResponseDto)
	paymentChannel: PaymentChannelResponseDto

	@Expose()
	@Type(() => JobStatusResponseDto)
	status: JobStatusResponseDto

	@Expose()
	@Type(() => UserResponseDto)
	assignee: UserResponseDto[]
}

export class JobStaffResponseDto extends OmitType(JobResponseDto, [
	'incomeCost'
] as const) { }