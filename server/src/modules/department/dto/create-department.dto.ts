import { IsOptional, IsString, Matches, IsNotEmpty } from 'class-validator'

export class CreateDepartmentDto {
	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsString()
	notes?: string

	@IsString()
	@IsNotEmpty()
	code: string

	@IsOptional()
	@IsString()
	@Matches(/^#([0-9A-Fa-f]{6})$/, {
		message: 'hexColor must be a valid hex color code (e.g. #FFFFFF)',
	})
	hexColor?: string
}
