import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator"

export class ChangeStatusDto {
	@ApiProperty({ description: 'ID of the current status' })
	@IsString()
	@IsNotEmpty()
	fromStatusId: string

	@ApiProperty({ description: 'ID of the new status' })
	@IsString()
	@IsNotEmpty()
	toStatusId: string
}