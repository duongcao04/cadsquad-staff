import { IsString, IsBoolean, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDeviceDto {
	@IsString()
	userId: string;

	@IsString()
	type: string;

	@IsOptional()
	@IsBoolean()
	status?: boolean = false;

	@IsOptional()
	@IsArray()
	values?: string[] = [];
}