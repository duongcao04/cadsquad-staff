import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { RoleEnum } from '@prisma/client'

export class CreateUserDto {
	@ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
	@IsEmail()
	email: string

	@ApiProperty({ description: 'Username', required: false, example: 'john.doe' })
	@IsOptional()
	@IsString()
	username?: string

	@ApiProperty({ description: 'Display name of the user', example: 'John Doe' })
	@IsString()
	displayName: string

	@ApiProperty({ description: 'User password', required: false, example: 'password123' })
	@IsOptional()
	@IsString()
	password?: string

	@ApiProperty({ description: 'URL of the user avatar', required: false, example: 'https://example.com/avatar.png' })
	@IsOptional()
	@IsString()
	avatar?: string

	@ApiProperty({ description: 'ID of the user\'s job title', required: false })
	@IsOptional()
	@IsString()
	jobTitleId?: string

	@ApiProperty({ description: 'ID of the user\'s department', required: false })
	@IsOptional()
	@IsString()
	departmentId?: string

	@ApiProperty({ description: 'User phone number', required: false, example: '+1234567890' })
	@IsOptional()
	@IsString()
	phoneNumber?: string

	@ApiProperty({ description: 'Role of the user', enum: RoleEnum, required: false })
	@IsOptional()
	role?: RoleEnum
}
