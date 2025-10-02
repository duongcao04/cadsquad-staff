import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { ActivityType, Job, Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { JobResponseDto, JobStaffResponseDto } from './dto/job-response.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { JobTabEnum } from './enums/job-tab.enum'
import dayjs from 'dayjs'
import { UserService } from '../user/user.service'
import { ConfigService } from '../config/config.service'
import { userConfigCode } from '../../common/constants/user-config-code.constant'
import { NotificationService } from '../notification/notification.service'
import { CreateNotificationDto } from '../notification/dto/create-notification.dto'
import { UpdateJobDto } from './dto/update-job.dto'

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) { }

  /**
   * Create a new job.
   */
  async create(data: CreateJobDto): Promise<Job> {
    const { assigneeIds, ...jobData } = data
    const result = await this.prisma.$transaction(async (tx) => {
      const statusId = await this.prisma.jobStatus.findUnique({ where: { order: 1 } }).then(res => res?.id ?? '')

      const job = await tx.job.create({
        data: {
          ...jobData,
          priority: jobData.priority as Job['priority'], // Ensure correct enum type
          statusId: statusId,
          assignee: assigneeIds
            ? {
              connect: assigneeIds.map((id) => ({ id })),
            }
            : undefined,
          attachmentUrls: jobData.attachmentUrls
            ? Array.isArray(jobData.attachmentUrls)
              ? jobData.attachmentUrls
              : [jobData.attachmentUrls]
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

      // 2. Create notifications for each assignee
      const notifications = assigneeIds?.map((memberId) => {
        const notification: CreateNotificationDto = {
          userId: memberId,
          title: 'New Job Assignment',
          content: `You have been assigned to job #${job.no} - ${job.displayName}.`,
          type: "JOB_UPDATE",
          imageUrl: job.status.thumbnailUrl ?? undefined
        }
        return notification
      })
      await tx.notification.createMany({
        data: notifications ?? [],
      });

      return job
    })

    return plainToInstance(JobResponseDto, result, {
      excludeExtraneousValues: true,
    }) as unknown as Job
  }

  async getColumns(userId: string) {
    const allColumns = [
      'no',
      'thumbnail',
      'type',
      'displayName',
      'description',
      'attachmentUrls',
      'clientName',
      'incomeCost',
      'staffCost',
      'assignee',
      'paymentChannel',
      'status',
      'isPaid',
      'dueAt',
      'completedAt',
      'createdAt',
      'updatedAt',
      'action',
    ]
    const userRole = await this.userService.getUserRole(userId)
    const showColumns = await this.configService.findByCode(
      userId,
      userConfigCode.JOB_SHOW_COLUMNS,
    )

    const finalColumns = showColumns
      ? JSON.parse(showColumns.value)
      : allColumns

    return userRole !== 'ADMIN'
      ? finalColumns.filter((key: keyof Job) => key !== 'incomeCost')
      : finalColumns
  }

  /**
   * Find all jobs with relations.
   */
  async findAll(
    userId: string,
    query: JobQueryDto,
  ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
    const {
      page = '1',
      hideFinishItems = '0',
      limit = '10',
      search,
      tab = JobTabEnum.ACTIVE,
    } = query

    const queryByTab = await this.queryTab(tab)

    const where: Prisma.JobWhereInput = {
      ...(Boolean(parseInt(hideFinishItems))
        ? {
          status: { isNot: { order: 5 } },
        }
        : {}),
      ...queryByTab,
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
              },
            },
          },
        ],
      }),
      assignee: { some: { id: userId } },
    }

    const jobs = await this.prisma.job.findMany({
      where,
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
    const countTotal = await this.prisma.job.count({ where })

    const isAdmin = (await this.userService.getUserRole(userId)) === 'ADMIN'
    const responseDto = isAdmin ? JobResponseDto : JobStaffResponseDto

    const data = jobs.map((j) =>
      plainToInstance(responseDto, j, { excludeExtraneousValues: true }),
    ) as unknown as Job[]

    return {
      data,
      paginate: {
        limit: parseInt(limit),
        page: parseInt(page),
        total: countTotal,
        totalPages: Math.ceil(countTotal / parseInt(limit)),
      },
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
      const activeFilter = {
        ...where,
        dueAt: {
          gte: today,
        },
      }
      const completedFilter = {
        ...where,
        status: {
          is: {
            displayName: 'Completed',
          },
        },
      }
      const deliveredFilter = {
        ...where,
        status: {
          is: {
            displayName: 'Delivered',
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
                displayName: 'Completed',
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
    if (!jobNo) {
      throw new BadRequestException('Job no is invalid')
    }
    if (!userId) {
      throw new UnauthorizedException()
    }
    const job = await this.prisma.job.findUnique({
      where: { no: jobNo, assignee: { some: { id: userId } } },
      include: {
        type: true,
        assignee: true,
        createdBy: true,
        paymentChannel: true,
        status: true,
        comment: true,
        activityLog: {
          include: {
            modifiedBy: true,
          },
        },
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

  /**
   * Update job by ID.
   */
  async update(jobId: string, data: UpdateJobDto): Promise<Job> {
    try {
      const { typeId, ...restData } = data
      const updated = await this.prisma.job.update({
        where: { id: jobId },
        data: {
          ...restData,
          attachmentUrls: data.attachmentUrls
            ? Array.isArray(data.attachmentUrls)
              ? data.attachmentUrls
              : [data.attachmentUrls]
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
      return plainToInstance(JobResponseDto, updated, {
        excludeExtraneousValues: true,
      }) as unknown as Job
    } catch (error) {
      throw new NotFoundException('Job not found')
    }
  }

  async changeStatus(
    jobId: string,
    modifierId: string,
    data: ChangeStatusDto,
  ): Promise<{ id: string }> {
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
            activityType: ActivityType.ChangeStatus,
          },
        })
      })
      return { id: jobId }
    } catch (error) {
      throw new InternalServerErrorException('Change status failed')
    }
  }

  async updateMembers(
    jobId: string,
    modifierId: string,
    data: UpdateJobMembersDto,
  ): Promise<{ id: string }> {
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
          activityType: ActivityType.AssignMember,
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

  async removeMember(
    jobId: string,
    modifierId: string,
    memberId: string,
  ): Promise<{ id: string }> {
    if (!jobId) {
      throw new BadRequestException('Job ID invalid')
    }
    if (!memberId) {
      throw new BadRequestException('Member ID invalid')
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find job
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: { statusId: true, assignee: { select: { id: true } } },
      })
      if (!job) throw new NotFoundException('Job not found')

      // check if member exists in assignee list
      const prevMemberIds = job.assignee.map((m) => m.id)
      if (!prevMemberIds.includes(memberId)) {
        throw new NotFoundException('Member not assigned to this job')
      }

      // 2. Update job - remove the member
      await tx.job.update({
        where: { id: jobId },
        data: {
          assignee: {
            disconnect: { id: memberId },
          },
        },
      })

      // 3. Create activity log
      const updatedMemberIds = prevMemberIds.filter((id) => id !== memberId)

      await tx.jobActivityLog.create({
        data: {
          activityType: ActivityType.AssignMember,
          previousValue: JSON.stringify(prevMemberIds),
          currentValue: JSON.stringify(updatedMemberIds),
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
        id: deleted.id,
      }
    } catch (error) {
      throw new NotFoundException('Job not found')
    }
  }
}
