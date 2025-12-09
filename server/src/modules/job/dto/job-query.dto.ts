import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger'
import { JobStatusSystemType, Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import dayjs from 'dayjs'
import { JobTabEnum } from '../enums/job-tab.enum'
import { JobFiltersDto } from './job-filters.dto'
import { JobSortDto } from './job-sort.dto'; // Assuming you renamed JobOrderByDto to JobSortDto

// 1. Combine Filters and Sorts first
class FiltersAndSorts extends IntersectionType(JobFiltersDto, JobSortDto) { }

// 2. Combine with Base Pagination & Search
export class JobQueryDto extends FiltersAndSorts {
    @ApiPropertyOptional({
        description: 'Tab to filter jobs by',
        enum: JobTabEnum,
        default: JobTabEnum.ACTIVE,
    })
    @IsOptional()
    @IsEnum(JobTabEnum)
    tab?: JobTabEnum = JobTabEnum.ACTIVE

    @ApiPropertyOptional({ description: 'Search keywords' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiPropertyOptional({
        description: 'Hide finished items (1 for true, 0 for false)',
        default: '0',
    })
    @IsOptional()
    @IsString()
    hideFinishItems?: string = '0'

    // --- Pagination ---

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @Type(() => Number) // Standard way to convert Query param string to Number
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1

    /**
     * Fixes TS2532: explicitly handle 'undefined' with fallbacks.
     */
    get skip(): number {
        const p = this.page || 1;
        const l = this.limit || 10;
        return (p - 1) * l;
    }
}

export class JobQueryBuilder {
    static buildQueryTab(tab: JobTabEnum = JobTabEnum.ACTIVE): Prisma.JobWhereInput {
        const today = dayjs().startOf('day').toDate()
        const dayAfterTomorrow = dayjs().add(2, 'day').startOf('day').toDate()

        // 1. Reusable Logic: Exclude finished statuses
        const isNotFinished: Prisma.JobWhereInput = {
            status: {
                systemType: { notIn: [JobStatusSystemType.COMPLETED, JobStatusSystemType.TERMINATED] },
            },
        }

        switch (tab) {
            case JobTabEnum.PRIORITY:
                return {
                    dueAt: {
                        gt: today,
                        lt: dayAfterTomorrow,
                    },
                    ...isNotFinished,
                }

            case JobTabEnum.LATE:
                return {
                    dueAt: {
                        lte: today,
                    },
                    ...isNotFinished,
                }

            case JobTabEnum.ACTIVE:
                return {
                    dueAt: {
                        gt: today,
                    },
                    ...isNotFinished, // Added this to ensure Completed jobs don't show in Active
                }

            case JobTabEnum.COMPLETED:
                return {
                    status: { systemType: JobStatusSystemType.COMPLETED },
                }

            case JobTabEnum.DELIVERED:
                return {
                    status: { code: 'delivered' },
                }

            case JobTabEnum.CANCELLED:
                return {
                    deletedAt: { not: null },
                }

            default:
                return {
                    dueAt: { gt: today },
                    ...isNotFinished,
                }
        }
    }

    static buildSearch(
        search?: string,
        searchableFields: string[] = ['no']
    ): Prisma.JobWhereInput {
        if (!search) return {}

        return {
            OR: searchableFields.map((field) => ({
                [field]: { contains: search, mode: 'insensitive' },
            })),
        }
    }
}