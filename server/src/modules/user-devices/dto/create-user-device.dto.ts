import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDeviceDto {
	@ApiProperty({ description: 'ID of the user', example: 'user-id-123' })
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty({ description: 'Type of the device', default: 'browser', example: 'browser' })
	@IsOptional()
	@IsString()
	type: string = 'browser';

	@ApiProperty({ description: 'Status of the device', default: false, example: true })
	@IsOptional()
	@IsBoolean()
	status?: boolean = false;

	@ApiProperty({ description: 'The value of the device subscription', example: '{"endpoint":"...","keys":{"p256dh":"...","auth":"..."}}' })
	@IsNotEmpty()
	@IsString()
	value: string
}