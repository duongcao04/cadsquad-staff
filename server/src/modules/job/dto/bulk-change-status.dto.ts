import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class BulkChangeStatusDto {
	@IsArray()
	@IsNotEmpty()
	jobIds: string[]

	@IsString()
	@IsNotEmpty()
	toStatusId: string
}