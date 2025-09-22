import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { RoleEnum } from '@prisma/client'

export class CreateUserDto {
	@IsEmail()
	email: string

	@IsString()
	username: string

	@IsString()
	displayName: string

	@IsString()
	@MinLength(6)
	password: string

	@IsOptional()
	@IsString()
	avatar?: string

	@IsOptional()
	@IsString()
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
