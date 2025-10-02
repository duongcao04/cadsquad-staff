import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

export class CreateJobTitleDto {
	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsString()
	notes?: string

	@IsString()
	@IsNotEmpty()
	code: string
}
