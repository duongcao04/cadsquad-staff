import { ApiProperty } from '@nestjs/swagger'
import { RoleEnum } from '@prisma/client'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({
        description: 'Display name of the user',
        example: 'John Doe',
    })
    @IsString()
    displayName: string

    @ApiProperty({ description: 'User email', example: 'john.doe@cadsquad.vn' })
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'Role of the user',
        enum: RoleEnum,
        required: false,
    })
    @IsOptional()
    role?: RoleEnum = RoleEnum.USER

    @ApiProperty({
        description: 'User password',
        required: false,
        example: 'password123',
    })
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty({ description: "ID of the user's job title", required: false })
    @IsOptional()
    @IsUUID()
    jobTitleId?: string

    @ApiProperty({
        description: "ID of the user's department",
        required: false,
    })
    @IsOptional()
    @IsUUID()
    departmentId?: string
}
