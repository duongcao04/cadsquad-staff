import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RescheduleJobDto {
	@IsString()
	@IsNotEmpty()
	@IsISO8601()
	fromDate: string

	@IsString()
	@IsNotEmpty()
	@IsISO8601()
	toDate: string
}
