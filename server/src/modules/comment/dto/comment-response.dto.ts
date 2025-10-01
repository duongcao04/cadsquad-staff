import { Expose, Type } from 'class-transformer'
import { JobResponseDto } from '../../job/dto/job-response.dto'
import { UserResponseDto } from '../../user/dto/user-response.dto'

export class CommentResponseDto {
	@Expose()
	id: string

	@Expose()
	content: string

	@Expose()
	jobId: string

	@Expose()
	@Type(() => JobResponseDto)
	job: JobResponseDto

	@Expose()
	userId: string

	@Expose()
	@Type(() => UserResponseDto)
	user: string

	@Expose()
	parentId?: string

	@Expose()
	@Type(() => CommentResponseDto)
	parent?: CommentResponseDto[]

	@Expose()
	@Type(() => CommentResponseDto)
	replies?: CommentResponseDto[]

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
