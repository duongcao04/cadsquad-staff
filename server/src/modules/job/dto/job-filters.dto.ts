import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class JobFiltersDto {
  // Client Name filter
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  clientName?: string[]

  // Job Type filter
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  type?: string[]

  // Job Status filter
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  status?: string[]

  // Assignee filter
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map((v: string) => v.trim())
  })
  assignee?: string[]

  // Payment Channel filter
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined
    return Array.isArray(value) ? value : value.split(',').map(v => v.trim())
  })
  paymentChannel?: string[]

  // Date range filters
  @IsOptional()
  @IsString()
  createdAtFrom?: string

  @IsOptional()
  @IsString()
  createdAtTo?: string

  @IsOptional()
  @IsString()
  dueAtFrom?: string

  @IsOptional()
  @IsString()
  dueAtTo?: string

  @IsOptional()
  @IsString()
  completedAtFrom?: string

  @IsOptional()
  @IsString()
  completedAtTo?: string

  @IsOptional()
  @IsString()
  updatedAtFrom?: string

  @IsOptional()
  @IsString()
  updatedAtTo?: string

  @IsOptional()
  @IsString()
  finishedAtFrom?: string

  @IsOptional()
  @IsString()
  finishedAtTo?: string

  // Cost range filters
  @IsOptional()
  @IsString()
  incomeCostMin?: string

  @IsOptional()
  @IsString()
  incomeCostMax?: string

  @IsOptional()
  @IsString()
  staffCostMin?: string

  @IsOptional()
  @IsString()
  staffCostMax?: string
}