import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateJobDto extends PartialType(
	OmitType(CreateJobDto, ['createdById', 'assigneeIds', 'no', 'attachmentUrls', 'priority'] as const)
) {
	@ApiProperty({
		description: 'URLs of attachments',
		type: [String],
		required: false,
	})
	@IsOptional()
	@IsArray()
	attachmentUrls?: string
}