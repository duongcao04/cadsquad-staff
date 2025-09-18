import {
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	IsNotEmpty,
} from 'class-validator'

export class CreatePaymentChannelDto {
	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsOptional()
	@IsString()
	@Matches(/^#([0-9A-Fa-f]{6})$/, {
		message: 'hexColor must be a valid hex color code (e.g. #FFFFFF)',
	})
	hexColor?: string

	@IsOptional()
	@IsUrl({}, { message: 'logoUrl must be a valid URL' })
	logoUrl?: string

	@IsOptional()
	@IsString()
	ownerName?: string

	@IsOptional()
	@IsString()
	cardNumber?: string
}
