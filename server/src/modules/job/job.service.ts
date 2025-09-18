import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { ACTIVITY_TYPE, Job } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { JobResponseDto } from './dto/job-response.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { ActivityLogService } from './activity-log.service'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { JobTabEnum } from './enums/job-tab.enum'
import dayjs from 'dayjs'

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new job.
   */
  async create(data: CreateJobDto): Promise<Job> {
    const job = await this.prisma.job.create({
      data: {
        ...data,
        priority: data.priority as Job['priority'], // Ensure correct enum type
        assignee: data.assigneeIds
          ? {
            connect: data.assigneeIds.map((id) => ({ id })),
          }
          : undefined,
      },
      include: {
        type: true,
        assignee: true,
        createdBy: true,
        paymentChannel: true,
        status: true,
      },
    })
    return plainToInstance(JobResponseDto, job, {
      excludeExtraneousValues: true,
    }) as unknown as Job
  }

  /**
   * Find all jobs with relations.
   */
  async findAll(userId: string, query: JobQueryDto): Promise<{ data: Job[], paginate: PaginationMeta }> {
    const { page = '1', hideFinishItems, limit = '10', search, tab = JobTabEnum.ACTIVE } = query
    const jobs = await this.prisma.job.findMany({
      where: {
        ...(Boolean(hideFinishItems) && {
          status: {
            isNot: {
              order: 5,
            },
          },
        }),
        ...this.queryTab(tab),
        ...(search && {
          OR: [
            {
              displayName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              no: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              type: {
                displayName: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
                code: {
                  contains: search,
                  mode: 'insensitive' as const,
                }
              },
            },
          ],
        }),
        assignee: { some: { id: userId } },
      },
      include: {
        type: true,
        assignee: true,
        createdBy: true,
        paymentChannel: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    })
    const data = jobs.map((j) =>
      plainToInstance(JobResponseDto, j, { excludeExtraneousValues: true })
    ) as unknown as Job[]
    return {
      data,
      paginate: {
        limit: parseInt(limit),
        page: parseInt(page),
        total: data.length,
        totalPages: Math.ceil(data.length / parseInt(limit))
      }
    }
  }

  async queryTab(tab: JobTabEnum) {
    {
      const today = dayjs().startOf('day').toDate()
      const dayAfterTomorrow = dayjs().add(2, 'day').startOf('day').toDate()

      const where: Record<string, unknown> = {
        deletedAt: null,
      }

      const priorityFilter = {
        ...where,
        dueAt: {
          gte: today,
          lt: dayAfterTomorrow, // trước ngày kia, tức là chỉ trong 2 ngày gần nhất (nay + mai)
        },
      }
      const activeFilter = where
      const completedFilter = {
        ...where,
        status: {
          is: {
            title: 'Completed',
          },
        },
      }
      const deliveredFilter = {
        ...where,
        status: {
          is: {
            title: 'Delivered',
          },
        },
      }
      const lateFilter = {
        ...where,
        AND: [
          {
            dueAt: {
              lte: today,
            },
          },
          {
            status: {
              NOT: {
                title: 'Completed',
              },
            },
          },
        ],
      }
      const cancelledFilter = {
        deletedAt: { not: null },
      }

      switch (tab) {
        case 'priority':
          return priorityFilter
        case 'active':
          return activeFilter
        case 'completed':
          return completedFilter
        case 'delivered':
          return deliveredFilter
        case 'late':
          return lateFilter
        case 'cancelled':
          return cancelledFilter
        default:
          return activeFilter
      }
    }

  }

  /**
   * Find job by ID.
   */
  async findByJobNo(userId: string, jobNo: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { no: jobNo, assignee: { some: { id: userId } } },
      include: {
        type: true,
        assignee: true,
        createdBy: true,
        paymentChannel: true,
        status: true,
      },
    })

    if (!job) throw new NotFoundException('Job not found')

    return plainToInstance(JobResponseDto, job, {
      excludeExtraneousValues: true,
    }) as unknown as Job
  }

  /**
   * Find job by ID.
   */
  async findById(jobId: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        type: true,
        assignee: true,
        createdBy: true,
        paymentChannel: true,
        status: true,
      },
    })

    if (!job) throw new NotFoundException('Job not found')

    return plainToInstance(JobResponseDto, job, {
      excludeExtraneousValues: true,
    }) as unknown as Job
  }

  // /**
  //  * Update job by ID.
  //  */
  // async update(jobId: string, data: UpdateJobDto): Promise<Job> {
  //   try {
  //     const updated = await this.prisma.job.update({
  //       where: { id: jobId },
  //       data: {
  //         ...data,
  //         assignee: data.assigneeIds
  //           ? {
  //             set: data.assigneeIds.map((id) => ({ id })), // reset relations
  //           }
  //           : undefined,
  //       },
  //       include: {
  //         type: true,
  //         assignee: true,
  //         createdBy: true,
  //         paymentChannel: true,
  //         status: true,
  //       },
  //     })
  //     return plainToInstance(JobResponseDto, updated, {
  //       excludeExtraneousValues: true,
  //     }) as unknown as Job
  //   } catch (error) {
  //     throw new NotFoundException('Job not found')
  //   }
  // }

  async changeStatus(jobId: string, modifierId: string, data: ChangeStatusDto): Promise<{ id: string }> {
    if (!jobId) {
      throw new BadRequestException('Job ID invalid')
    }
    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        // 1. Find job
        const job = await tx.job.findUnique({
          where: { id: jobId },
          select: { statusId: true },
        })
        if (!job) throw new NotFoundException('Job not found')

        // 2. Update job
        const updatedJob = await tx.job.update({
          where: { id: jobId },
          data: { statusId: data.toStatusId },
        })

        // 3. Create activity log
        await tx.jobActivityLog.create({
          data: {
            jobId: jobId,
            previousValue: data.fromStatusId,
            currentValue: data.toStatusId,
            modifiedById: modifierId,
            fieldName: 'status',
            activityType: ACTIVITY_TYPE.ChangeStatus,
          },
        })
      })
      return { id: jobId }
    } catch (error) {
      throw new InternalServerErrorException('Change status failed')
    }
  }

  async updateMembers(jobId: string, modifierId: string, data: UpdateJobMembersDto): Promise<{ id: string }> {
    if (!jobId) {
      throw new BadRequestException('Job ID invalid')
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find job
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: { statusId: true },
      })
      if (!job) throw new NotFoundException('Job not found')

      // 2. Update members
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          ...(data.updateMemberIds &&
            JSON.parse(data.updateMemberIds).length > 0 && {
            assignee: {
              connect: JSON.parse(data.updateMemberIds).map((id: string) => ({
                id,
              })),
            },
          }),
        },
      })

      // 3. Create activity log
      await tx.jobActivityLog.create({
        data: {
          activityType: ACTIVITY_TYPE.AssignMember,
          previousValue: data.prevMemberIds,
          currentValue: data.updateMemberIds,
          fieldName: 'Assignee',
          modifiedById: modifierId,
          jobId,
        },
      })

      return { id: jobId }
    })
  }

  /**
   * Delete job by ID (soft delete: set deletedAt).
   */
  async delete(jobId: string): Promise<{ id: string }> {
    try {
      const deleted = await this.prisma.job.update({
        where: { id: jobId },
        data: { deletedAt: new Date() },
      })
      return {
        id: deleted.id
      }
    } catch (error) {
      throw new NotFoundException('Job not found')
    }
  }
}
