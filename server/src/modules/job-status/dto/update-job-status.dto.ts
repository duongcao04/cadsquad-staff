import { PartialType } from '@nestjs/mapped-types';
import { CreateJobStatusDto } from './create-job-status.dto';

export class UpdateJobStatusDto extends PartialType(CreateJobStatusDto) {}
