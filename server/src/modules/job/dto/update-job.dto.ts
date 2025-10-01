import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(
	OmitType(CreateJobDto, ['createdById', 'assigneeIds', 'no', 'paymentChannelId', 'attachmentUrls', 'priority'] as const)
) { }