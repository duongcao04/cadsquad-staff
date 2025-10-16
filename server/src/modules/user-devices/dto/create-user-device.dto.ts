import { IsString, IsBoolean, IsOptional, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDeviceDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsOptional()
	@IsString()
	type: string = 'browser';

	@IsOptional()
	@IsBoolean()
	status?: boolean = false;

	@IsNotEmpty()
	@IsString()
	value: string
}