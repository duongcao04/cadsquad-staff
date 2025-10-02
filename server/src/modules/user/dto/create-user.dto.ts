import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { RoleEnum } from '@prisma/client'

export class CreateUserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	username?: string

	@IsString()
	displayName: string

	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	avatar?: string

	@IsOptional()
	@IsArray()
	jobTitleIds?: string[]

	@IsOptional()
	@IsString()
	departmentId?: string

	@IsOptional()
	@IsString()
	phoneNumber?: string

	@IsOptional()
	role?: RoleEnum
}
