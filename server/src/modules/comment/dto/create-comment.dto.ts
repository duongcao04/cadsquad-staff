import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommentDto {
	@ApiProperty({ description: 'The content of the comment' })
	@IsString()
	@IsNotEmpty()
	content: string

	@ApiProperty({ description: 'The ID of the job this comment belongs to' })
	@IsString()
	@IsNotEmpty()
	jobId: string

	@ApiProperty({ description: 'The ID of the parent comment, if this is a reply', required: false })
	@IsOptional()
	@IsString()
	parentId?: string
}
