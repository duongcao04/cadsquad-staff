import { IsNotEmpty, IsString } from 'class-validator'

export class CreateConfigDto {
	@IsNotEmpty()
	@IsString()
	displayName: string

	@IsNotEmpty()
	@IsString()
	code: string

	@IsNotEmpty()
	@IsString()
	value: string
}
