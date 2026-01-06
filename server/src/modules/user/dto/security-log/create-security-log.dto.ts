// src/modules/user/dto/create-security-log.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { SecurityLogStatus } from '@prisma/client'
import {
    IsEnum,
    IsIP,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator'

export class CreateSecurityLogDto {
    @ApiProperty({ description: 'ID của người dùng thực hiện hành động' })
    @IsUUID()
    @IsNotEmpty()
    userId: string

    @ApiProperty({ description: 'Tên sự kiện', example: 'Login Success' })
    @IsString()
    @IsNotEmpty()
    event: string

    @ApiProperty({
        description: 'Trạng thái sự kiện',
        enum: SecurityLogStatus,
        default: SecurityLogStatus.SUCCESS,
    })
    @IsEnum(SecurityLogStatus)
    @IsOptional()
    status?: SecurityLogStatus

    @ApiProperty({ description: 'Địa chỉ IP của thiết bị', required: false })
    @IsIP()
    @IsOptional()
    ipAddress?: string

    @ApiProperty({
        description: 'Thông tin trình duyệt/thiết bị',
        required: false,
    })
    @IsString()
    @IsOptional()
    userAgent?: string
}
