import { IsOptional, IsString } from 'class-validator'
import { JobTabEnum } from '../enums/job-tab.enum'
import { JobFiltersDto } from './job-filters.dto'

export class JobQueryDto extends JobFiltersDto {
	@IsOptional()
	@IsString()
	tab?: JobTabEnum = JobTabEnum.ACTIVE

	@IsOptional()
	@IsString()
	search?: string

	@IsOptional()
	@IsString()
	hideFinishItems?: string = '0'

	@IsOptional()
	@IsString()
	limit?: string = '10'

	@IsOptional()
	@IsString()
	page?: string = '1'

	/**
	 * Parses a sort query string into a Prisma-compatible `orderBy` array.
	 *
	 * This utility converts strings like:
	 * ```
	 * -incomeCost,+staffCost
	 * ```
	 * into:
	 * ```ts
	 * [
	 *   { incomeCost: 'desc' },
	 *   { staffCost: 'asc' }
	 * ]
	 * ```
	 *
	 * Supports both "+" (ascending) and "-" (descending) prefixes.
	 * Automatically trims spaces and ignores empty segments.
	 *
	 * Optionally, you can restrict sorting to a list of allowed fields.
	 * Invalid or disallowed fields will be skipped.
	 * 
	 * @example
	 * ```ts
	 * parseSortParam('-price,+createdAt')
	 * => [ { price: 'desc' }, { createdAt: 'asc' } ]
	 *
	 * parseSortParam('-price,+unknown', ['price'])
	 * => [ { price: 'desc' } ] 'unknown' is ignored
	 * ```
	 */
	@IsOptional()
	@IsString()
	sort?: string = '-createdAt'
}
