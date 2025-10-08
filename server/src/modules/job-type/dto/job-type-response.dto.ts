import { Job } from '@prisma/client'
import { Expose, Type } from 'class-transformer'
import { JobResponseDto } from '../../job/dto/job-response.dto'

export class JobTypeResponseDto {
	@Expose()
	id: string

	@Expose()
	code: string

	@Expose()
	displayName: string

	@Expose()
	hexColor?: string

	@Expose()
	@Type(() => JobResponseDto)
	jobs?: JobResponseDto[]

	@Expose()
	_count: Record<string, unknown>
}
