import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateJobTypeDto {
	@IsString()
	@IsNotEmpty()
	code: string

	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsString()
	@Matches(/^#([0-9A-Fa-f]{6})$/, {
		message: 'hexColor must be a valid hex color code (e.g. #FFFFFF)',
	})
	hexColor?: string
}
