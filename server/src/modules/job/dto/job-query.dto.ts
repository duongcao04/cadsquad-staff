import { IsOptional, IsString } from "class-validator";
import { JobTabEnum } from "../enums/job-tab.enum";

export class JobQueryDto {
	@IsOptional()
	@IsString()
	tab?: JobTabEnum = JobTabEnum.ACTIVE

	@IsOptional()
	@IsString()
	search?: string

	@IsOptional()
	@IsString()
	hideFinishItems?: boolean = false

	@IsOptional()
	@IsString()
	limit?: string = '10'

	@IsOptional()
	@IsString()
	page?: string = '1'
}