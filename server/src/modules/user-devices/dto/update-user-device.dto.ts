import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDeviceDto } from './create-user-device.dto';
import { IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateUserDeviceDto extends PartialType(CreateUserDeviceDto) {
	@IsOptional()
	@IsBoolean()
	status?: boolean;

	@IsOptional()
	@IsArray()
	values?: string[];
}