import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { JobTabEnum } from '../enums/job-tab.enum'
import { JobFiltersDto } from './job-filters.dto'

export class JobQueryDto extends JobFiltersDto {
	@ApiPropertyOptional({
		description: 'Tab to filter jobs by',
		enum: JobTabEnum,
		default: JobTabEnum.ACTIVE,
	})
	@IsOptional()
	@IsString()
	tab?: JobTabEnum = JobTabEnum.ACTIVE

	@ApiPropertyOptional({ description: 'Search keywords' })
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({
		description: 'Hide finished items (1 for true, 0 for false)',
		default: '0',
	})
	@IsOptional()
	@IsString()
	hideFinishItems?: string = '0'

	@ApiPropertyOptional({ description: 'Number of items per page', default: '10' })
	@IsOptional()
	@IsString()
	limit?: string = '10'

	@ApiPropertyOptional({ description: 'Page number', default: '1' })
	@IsOptional()
	@IsString()
	page?: string = '1'

	@ApiPropertyOptional({
		description: 'Sort order, e.g., -createdAt,+displayName',
		default: '-createdAt',
	})
	@IsOptional()
	@IsString()
	sort?: string = '-createdAt'
}
