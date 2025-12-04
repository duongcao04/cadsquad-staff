import { ApiProperty } from '@nestjs/swagger'
import { RoleEnum } from '@prisma/client'
import { Expose } from 'class-transformer'

export class TokenPayload {
    @ApiProperty({ description: 'User ID (subject)' })
    @Expose()
    sub: string

    @ApiProperty({ description: 'User email' })
    @Expose()
    email: string

    @ApiProperty({ description: 'User role', enum: RoleEnum })
    @Expose()
    role: RoleEnum

    @ApiProperty({ description: 'Issued at timestamp' })
    @Expose()
    iat: string
}
