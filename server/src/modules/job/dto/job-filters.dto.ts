import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class JobFiltersDto {
  // Client Name filter
  @ApiProperty({
    description: 'Filter by client name. Can be a comma-separated list.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  clientName?: string[]

  // Job Type filter
  @ApiProperty({
    description: 'Filter by job type ID. Can be a comma-separated list.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  type?: string[]

  // Job Status filter
  @ApiProperty({
    description: 'Filter by job status ID. Can be a comma-separated list.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  status?: string[]

  // Assignee filter
  @ApiProperty({
    description: 'Filter by assignee ID. Can be a comma-separated list.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  assignee?: string[]

  // Payment Channel filter
  @ApiProperty({
    description: 'Filter by payment channel ID. Can be a comma-separated list.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map(v => v.trim())
  })
  paymentChannel?: string[]

  // Date range filters
  @ApiProperty({ description: 'Filter by creation date (from)', required: false })
  @IsOptional()
  @IsString()
  createdAtFrom?: string

  @ApiProperty({ description: 'Filter by creation date (to)', required: false })
  @IsOptional()
  @IsString()
  createdAtTo?: string

  @ApiProperty({ description: 'Filter by due date (from)', required: false })
  @IsOptional()
  @IsString()
  dueAtFrom?: string

  @ApiProperty({ description: 'Filter by due date (to)', required: false })
  @IsOptional()
  @IsString()
  dueAtTo?: string

  @ApiProperty({ description: 'Filter by completion date (from)', required: false })
  @IsOptional()
  @IsString()
  completedAtFrom?: string

  @ApiProperty({ description: 'Filter by completion date (to)', required: false })
  @IsOptional()
  @IsString()
  completedAtTo?: string

  @ApiProperty({ description: 'Filter by update date (from)', required: false })
  @IsOptional()
  @IsString()
  updatedAtFrom?: string

  @ApiProperty({ description: 'Filter by update date (to)', required: false })
  @IsOptional()
  @IsString()
  updatedAtTo?: string

  @ApiProperty({ description: 'Filter by finish date (from)', required: false })
  @IsOptional()
  @IsString()
  finishedAtFrom?: string

  @ApiProperty({ description: 'Filter by finish date (to)', required: false })
  @IsOptional()
  @IsString()
  finishedAtTo?: string

  // Cost range filters
  @ApiProperty({ description: 'Minimum income cost', required: false })
  @IsOptional()
  @IsString()
  incomeCostMin?: string

  @ApiProperty({ description: 'Maximum income cost', required: false })
  @IsOptional()
  @IsString()
  incomeCostMax?: string

  @ApiProperty({ description: 'Minimum staff cost', required: false })
  @IsOptional()
  @IsString()
  staffCostMin?: string

  @ApiProperty({ description: 'Maximum staff cost', required: false })
  @IsOptional()
  @IsString()
  staffCostMax?: string
}