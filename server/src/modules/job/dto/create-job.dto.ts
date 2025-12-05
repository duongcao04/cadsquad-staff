import { ApiProperty } from '@nestjs/swagger'
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator'

export class CreateJobDto {
    @ApiProperty({ description: 'Job number', example: 'JOB-2024-001' })
    @IsString()
    @IsNotEmpty()
    no: string

    @ApiProperty({ description: 'ID of the job type' })
    @IsUUID()
    typeId: string

    @ApiProperty({ description: 'Display name of the job' })
    @IsString()
    @IsNotEmpty()
    displayName: string

    @ApiProperty({
        description: 'Detailed description of the job',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        description: 'URLs of attachments',
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    attachmentUrls?: string

    @ApiProperty({ description: 'Name of the client', type: [String] })
    @IsString()
    @IsNotEmpty()
    clientName: string

    @ApiProperty({ description: 'Income cost for the job', type: [String] })
    @IsString()
    incomeCost: string

    @ApiProperty({ description: 'Staff cost for the job', type: [String] })
    @IsString()
    staffCost: string

    @ApiProperty({
        description: 'IDs of the assignees',
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    assigneeIds?: string[]

    @ApiProperty({ description: 'ID of the payment channel', required: false })
    @IsOptional()
    paymentChannelId: string

    @ApiProperty({ description: 'Start date of the job', required: false })
    @IsOptional()
    @IsString()
    startedAt?: Date

    @ApiProperty({
        description: 'Priority of the job (e.g., LOW, MEDIUM, HIGH)',
        required: false,
    })
    @IsOptional()
    @IsString()
    priority?: string // Could be validated against an enum (LOW, MEDIUM, HIGH)

    @ApiProperty({ description: 'Whether the job is pinned', required: false })
    @IsOptional()
    @IsBoolean()
    isPinned?: boolean

    @ApiProperty({
        description: 'Whether the job is published',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean

    @ApiProperty({ description: 'Whether the job is paid', required: false })
    @IsOptional()
    @IsBoolean()
    isPaid?: boolean

    @ApiProperty({ description: 'Due date of the job' })
    @IsString()
    dueAt: Date

    @ApiProperty({ description: 'Completion date of the job', required: false })
    @IsOptional()
    @IsString()
    completedAt?: Date

    @ApiProperty({ description: 'Deletion date of the job', required: false })
    @IsOptional()
    @IsString()
    deletedAt?: Date
}
