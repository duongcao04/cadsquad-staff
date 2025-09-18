import { IsNotEmpty, IsString } from "class-validator"

export class ChangeStatusDto {
	@IsString()
	@IsNotEmpty()
	fromStatusId: string

	@IsString()
	@IsNotEmpty()
	toStatusId: string
}