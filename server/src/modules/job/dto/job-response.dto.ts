import { Expose, Type } from 'class-transformer'

import { PaymentChannelResponseDto } from '../../payment-channel/dto/payment-channel-response.dto'
import { JobStatusResponseDto } from '../../job-status/dto/job-status-response.dto'
import { JobTypeResponseDto } from '../../job-type/dto/job-type-response.dto'
import { UserResponseDto } from '../../user/dto/user-response.dto'

export class JobResponseDto {
	@Expose()
	id: string

	@Expose()
	no: string

	@Expose()
	displayName: string

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
	startedAt: Date

	@Expose()
	dueAt: Date

	@Expose()
	completedAt?: Date

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
