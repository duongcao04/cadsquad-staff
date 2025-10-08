import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateJobDto extends PartialType(
	OmitType(CreateJobDto, ['createdById', 'assigneeIds', 'no', 'attachmentUrls', 'priority'] as const)
) {
	@IsOptional()
	@IsArray()
	attachmentUrls?: string
}