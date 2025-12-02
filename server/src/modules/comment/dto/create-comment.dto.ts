import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	content: string

	@IsString()
	@IsNotEmpty()
	jobId: string

	@IsOptional()
	@IsString()
	parentId?: string
}
