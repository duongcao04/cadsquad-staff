import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from "@prisma/client"

export class TokenPayload {
	@ApiProperty({ description: 'User ID (subject)' })
	sub: string

	@ApiProperty({ description: 'User email' })
	email: string

	@ApiProperty({ description: 'User role', enum: RoleEnum })
	role: RoleEnum

	@ApiProperty({ description: 'Issued at timestamp' })
	iat: string
}