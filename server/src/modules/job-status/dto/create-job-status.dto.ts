import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
} from 'class-validator'

export class CreateJobStatusDto {
	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsUrl({}, { message: 'thumbnailUrl must be a valid URL' })
	thumbnailUrl?: string

	@IsString()
	@IsNotEmpty()
	@Matches(/^#([0-9A-Fa-f]{6})$/, {
		message: 'hexColor must be a valid hex color code (e.g. #FFFFFF)',
	})
	hexColor: string

	@IsInt()
	@IsNotEmpty()
	order: number

	@IsOptional()
	@IsString()
	icon?: string

	@IsOptional()
	@IsInt()
	nextStatusOrder?: number

	@IsOptional()
	@IsInt()
	prevStatusOrder?: number
}
