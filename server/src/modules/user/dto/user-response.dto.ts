import { Exclude, Expose, Type } from 'class-transformer'
import { RoleEnum } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
	@ApiProperty({ description: 'User ID', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
	@Expose()
	id: string

	@Exclude()
	password: string

	@ApiProperty({ description: 'User email', example: 'user@example.com' })
	@Expose()
	email: string

	@ApiProperty({ description: 'Username', example: 'john.doe' })
	@Expose()
	username: string

	@ApiProperty({ description: 'User display name', example: 'John Doe' })
	@Expose()
	displayName: string

	@ApiProperty({ description: 'URL of the user avatar', required: false, example: 'https://example.com/avatar.png' })
	@Expose()
	avatar?: string

	@ApiProperty({ description: 'Job titles of the user', required: false })
	@Expose()
	jobTitles?: unknown

	@ApiProperty({ description: 'Department of the user', required: false })
	@Expose()
	department?: unknown

	@ApiProperty({ description: 'User phone number', required: false, example: '+1234567890' })
	@Expose()
	phoneNumber?: string

	@ApiProperty({ description: 'Role of the user', enum: RoleEnum })
	@Expose()
	role: RoleEnum

	@ApiProperty({ description: 'Whether the user is active', example: true })
	@Expose()
	isActive: boolean

	@ApiProperty({ description: 'Last login timestamp', required: false })
	@Expose()
	lastLoginAt?: Date

	@ApiProperty({ description: 'Creation timestamp' })
	@Expose()
	createdAt: Date

	@ApiProperty({ description: 'Last update timestamp' })
	@Expose()
	updatedAt: Date
}
