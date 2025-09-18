import { Exclude, Expose, Type } from 'class-transformer'
import { RoleEnum } from '@prisma/client'

export class UserResponseDto {
	@Exclude()
	id: string

	@Exclude()
	password: string

	@Expose()
	email: string

	@Expose()
	username: string

	@Expose()
	displayName: string

	@Expose()
	avatar?: string

	@Expose()
	jobTitle?: string

	@Expose()
	department?: string

	@Expose()
	phoneNumber?: string

	@Expose()
	role: RoleEnum

	@Expose()
	isActive: boolean

	@Expose()
	lastLoginAt?: Date

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
