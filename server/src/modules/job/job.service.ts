import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ActivityType, Job, JobStatusSystemType, Prisma, RoleEnum } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { userConfigCode } from '../../common/constants/user-config-code.constant'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { ConfigService } from '../config/config.service'
import { CreateNotificationDto } from '../notification/dto/create-notification.dto'
import { NotificationService } from '../notification/notification.service'
import { UserService } from '../user/user.service'
import { BulkChangeStatusDto } from './dto/bulk-change-status.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { JobFiltersDto } from './dto/job-filters.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto, JobStaffResponseDto } from './dto/job-response.dto'
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobTabEnum } from './enums/job-tab.enum'

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
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const statusId = await this.prisma.jobStatus
          .findUnique({ where: { order: 1 } })
          .then((res) => res?.id ?? '')

        const job = await tx.job.create({
          data: {
            ...jobData,
            priority: jobData.priority as Job['priority'], // Ensure correct enum type
            statusId: statusId,
            assignee: assigneeIds?.length
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
            type: 'JOB_UPDATE',
            imageUrl: job.status.thumbnailUrl ?? undefined,
          }
          return notification
        })
        await tx.notification.createMany({
          data: notifications ?? [],
        })

        return job
      })

      return plainToInstance(JobResponseDto, result, {
        excludeExtraneousValues: true,
      }) as unknown as Job
    } catch (error) {
      throw new InternalServerErrorException('Create job failed')
    }
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
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Get columns failed')
    }
  }

  async findAllNoPaginate(
    userId: string,
    userRole: RoleEnum,
    query: { keywords?: string },) {
    const { keywords } = query
    if (!keywords) {
      return []
    }

    const queryPermission =
      userRole === RoleEnum.ADMIN
        ? {}
        : {
          assignee: { some: { id: userId } },
        }

    const where: Prisma.JobWhereInput = {
      ...queryPermission,
      ...(keywords && {
        OR: [
          {
            displayName: {
              contains: keywords,
              mode: 'insensitive' as const,
            },
          },
          {
            no: {
              contains: keywords,
              mode: 'insensitive' as const,
            },
          },
          {
            type: {
              displayName: {
                contains: keywords,
                mode: 'insensitive' as const,
              },
              code: {
                contains: keywords,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }),
    }
    try {

      const jobs = await this.prisma.job.findMany({
        where,
        include: {
          status: {
            select: {
              thumbnailUrl: true
            }
          },
        },
        orderBy: { no: 'asc' },
      })

      const result = jobs.map((j) =>
        plainToInstance(this.responseSchema(userRole), j, { excludeExtraneousValues: true }),
      ) as unknown as Job[]

      return result
    } catch (error) {
      throw new InternalServerErrorException('Get jobs failed')
    }
  }

  /**
   * Find all jobs with relations.
   */
  async findAll(
    userId: string,
    userRole: RoleEnum,
    query: JobQueryDto,
  ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
    const {
      page = '1',
      hideFinishItems = '0',
      limit = '10',
      search,
      tab = JobTabEnum.ACTIVE,
      sort = 'displayName',
      assignee,
      clientName,
      type,
      completedAtFrom,
      completedAtTo,
      createdAtFrom,
      createdAtTo,
      dueAtFrom,
      dueAtTo,
      finishedAtFrom,
      finishedAtTo,
      incomeCostMax,
      incomeCostMin,
      paymentChannel,
      staffCostMax,
      staffCostMin,
      status,
      updatedAtFrom,
      updatedAtTo
    } = query

    const _filters = {
      assignee,
      clientName,
      type,
      completedAtFrom,
      completedAtTo,
      createdAtFrom,
      createdAtTo,
      dueAtFrom,
      dueAtTo,
      finishedAtFrom,
      finishedAtTo,
      incomeCostMax,
      incomeCostMin,
      paymentChannel,
      staffCostMax,
      staffCostMin,
      status,
      updatedAtFrom,
      updatedAtTo
    }

    // Pass filter field is undefined
    const filters = lodash.omitBy(_filters, lodash.isUndefined)

    const take = parseInt(limit || '10')
    const skip = (parseInt(page || '1') - 1) * take
    const orderBy = this.buildOrderBy(sort)

    const where: Prisma.JobWhereInput = {
      AND: [
        // Hide finished items filter
        ...(Boolean(parseInt(hideFinishItems))
          ? [{
            status: { isNot: { order: 5 } },
          }]
          : []),
        // Tab filter
        this.buildQueryTab(tab),
        // Permission filter
        this.buildPermission(userRole, userId),
        // Search filter
        this.buildSearchBy(search),
        // All other filters
        // ...this.buildFilters(filters),
      ]
      // .filter((condition) => Object.keys(condition).length > 0)
      ,
    }
    try {

      const [jobs, countTotal] = await Promise.all([
        this.prisma.job.findMany({
          where,
          include: {
            type: true,
            assignee: true,
            createdBy: true,
            paymentChannel: true,
            status: true,
          },
          orderBy,
          skip,
          take,
        }),
        this.prisma.job.count({ where }),
      ])
      const data = jobs.map((job) => ({ ...job, thumbnailUrl: job.status.thumbnailUrl })).map((job) =>
        plainToInstance(this.responseSchema(userRole), job, { excludeExtraneousValues: true }),
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
    } catch (error) {
      throw new InternalServerErrorException('Get jobs failed')
    }
  }

  /**
   * Find job by ID.
   */
  async findByJobNo(
    userId: string,
    userRole: RoleEnum,
    jobNo: string,
  ): Promise<Job> {
    if (!jobNo) {
      throw new BadRequestException('Job no is invalid')
    }
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          AND: [
            { no: jobNo },
            this.buildPermission(userRole, userId)
          ]
        },
        include: {
          type: true,
          assignee: true,
          createdBy: true,
          paymentChannel: true,
          status: true,
          comments: {
            include: {
              user: {
                select: {
                  username: true,
                  displayName: true,
                  avatar: true
                }
              }
            }
          },
          activityLog: {
            include: {
              modifiedBy: true,
            },
          },
        },
      })

      if (!job) throw new NotFoundException('Job not found')

      return plainToInstance(this.responseSchema(userRole), job, {
        excludeExtraneousValues: true,
      }) as unknown as Job
    } catch (error) {
      throw new InternalServerErrorException("Get job by no failed")
    }
  }

  /**
   * Find job by deadline.
   */
  async findJobDeadline(
    userId: string,
    userRole: RoleEnum,
    isoDate: string,
  ): Promise<Job[]> {
    if (!isoDate) {
      throw new BadRequestException('ISO date invalid')
    }

    const date = new Date(isoDate); // e.g. "2025-06-12"
    const startOfDayUtc = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0, 0, 0, 0
    ));
    const endOfDayUtc = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23, 59, 59, 999
    ));
    try {
      const result = await this.prisma.job.findMany({
        where: {
          AND: [
            { dueAt: { gte: startOfDayUtc, lt: endOfDayUtc } },
            this.buildPermission(userRole, userId)
          ]
        },
        include: {
          type: true,
          assignee: true,
          createdBy: true,
          paymentChannel: true,
          status: true,
          comments: true,
          activityLog: {
            include: {
              modifiedBy: true,
            },
          },
        },
      })

      if (!result) throw new NotFoundException('Jobs not found')

      return plainToInstance(this.responseSchema(userRole), result, {
        excludeExtraneousValues: true,
      }) as unknown as Job[]
    } catch (error) {
      throw new InternalServerErrorException("Get job by no failed")
    }
  }

  /**
   * Find job by ID.
   */
  async findById(jobId: string): Promise<Job> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException("Get job by id failed")
    }
  }

  /**
   * Lấy danh sách job đến hạn vào ngày input
   * @param inputDate ngày cần kiểm tra (Date hoặc string)
   * @returns danh sách job
   */
  async getJobsDueOnDate(userId: string, userRole: RoleEnum, inputDate: Date | string): Promise<Job[]> {
    const startOfDay = dayjs(inputDate).startOf('day').toDate();
    const endOfDay = dayjs(inputDate).endOf('day').toDate();
    try {

      const jobs = await this.prisma.job.findMany({
        where: {
          ...this.buildPermission(userRole, userId),
          dueAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          status: true,
          type: true
        },
        orderBy: { dueAt: 'asc' },
      });

      if (!jobs) {
        throw new NotFoundException('Jobs not found')
      }

      return plainToInstance(this.responseSchema(userRole), jobs, {
        excludeExtraneousValues: true,
      }) as unknown as Job[]
    } catch (error) {
      throw new InternalServerErrorException("Get jobs due on date failed")
    }
  }

  /**
   * Update job by ID.
   */
  async update(modifierId: string, jobId: string, data: UpdateJobDto): Promise<{ id: string, no: string }> {
    try {
      const { typeId, ...restData } = data

      const updated = await this.prisma.$transaction(async (tx) => {
        // 1. Find job
        const job = await tx.job.findUnique({
          where: { id: jobId },
          select: { statusId: true },
        })
        if (!job) throw new NotFoundException('Job not found')

        // 2. Update job
        const updateJob = await this.prisma.job.update({
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

        // 3. Create activity log
        await tx.jobActivityLog.create({
          data: {
            jobId: jobId,
            previousValue: JSON.stringify(data),
            currentValue: '',
            modifiedById: modifierId,
            fieldName: 'information',
            activityType: ActivityType.UpdateInformation,
          },
        })
        return updateJob.no
      })
      return { id: jobId, no: updated }
    } catch (error) {
      throw new InternalServerErrorException('Update job failed')
    }
  }

  async markPaid(
    jobId: string,
    modifierId: string,
  ): Promise<{ id: string; no: string }> {
    if (!jobId) {
      throw new BadRequestException('Job ID invalid');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Tìm Job để check trạng thái hiện tại
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: { id: true, no: true, isPaid: true },
      });

      if (!job) throw new NotFoundException('Job not found');

      // 2. Check Logic: Nếu đã trả rồi -> Throw lỗi
      if (job.isPaid) {
        throw new BadRequestException('Job has already been paid');
      }

      // 3. Update: Mark to Paid
      const updateJob = await tx.job.update({
        where: { id: jobId },
        data: {
          isPaid: true,
          paidAt: new Date(), // Nên lưu lại thời điểm thanh toán thực tế nếu DB có field này
        },
      });

      // 4. Ghi log
      await tx.jobActivityLog.create({
        data: {
          jobId: jobId,
          previousValue: 'false',
          currentValue: 'true',
          modifiedById: modifierId,
          fieldName: 'isPaid',
          activityType: ActivityType.UpdateInformation,
        },
      });

      return { id: updateJob.id, no: updateJob.no };
    });
  }

  async changeStatus(
    jobId: string,
    modifierId: string,
    data: ChangeStatusDto,
  ): Promise<{ id: string, no: string }> {
    if (!jobId) throw new BadRequestException('Job ID invalid');

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find job (Cần lấy field completedAt hiện tại để check)
      const job = await tx.job.findUnique({
        where: { id: jobId },
        // Không cần select cụ thể, lấy hết để có completedAt và statusId
      });

      if (!job) throw new NotFoundException('Job not found');

      // 2. Get Target Status
      const toStatus = await tx.jobStatus.findUnique({
        where: { id: data.toStatusId },
      });
      if (!toStatus) throw new NotFoundException('Target status not found');

      // 3. Xử lý Logic CompletedAt
      let newCompletedAt: Date | null = null;

      if (toStatus.systemType === JobStatusSystemType.COMPLETED) {
        // Case 1: Chuyển sang Completed -> Luôn set thời gian hiện tại
        newCompletedAt = new Date();
      } else if (toStatus.systemType === JobStatusSystemType.TERMINATED) {
        // Case 2: Chuyển sang Finish
        // Logic: Nếu đã có completedAt cũ thì giữ nguyên. Nếu chưa (null) thì set Now (nhảy cóc).
        newCompletedAt = job.completedAt ? job.completedAt : new Date();
      }
      // Case 3: Các trạng thái khác (Revision, In Progress) -> newCompletedAt vẫn là null (reset)

      // 4. Xử lý Logic FinishedAt & IsPaid
      const isTerminated = toStatus.systemType === JobStatusSystemType.TERMINATED;

      // 5. Update Job
      const updateJob = await tx.job.update({
        where: { id: jobId },
        data: {
          statusId: data.toStatusId,
          completedAt: newCompletedAt,             // Logic mới
          finishedAt: isTerminated ? new Date() : null, // Logic cũ: Finish mới có finishedAt
          isPaid: isTerminated ? true : false,          // Logic cũ
        },
      });

      // 6. Create activity log
      await tx.jobActivityLog.create({
        data: {
          jobId: jobId,
          previousValue: data.fromStatusId,
          currentValue: data.toStatusId,
          modifiedById: modifierId,
          fieldName: 'status',
          activityType: ActivityType.ChangeStatus,
        },
      });

      return { id: jobId, no: updateJob.no };
    });
  }

  async bulkChangeStatus(
    modifierId: string,
    data: BulkChangeStatusDto,
  ): Promise<{ jobIds: string }> {
    try {
      const results = await Promise.all(
        data.jobIds.map(async (jobId) => {
          const job = await this.prisma.job.findUnique({
            where: { id: jobId },
            select: { statusId: true },
          })

          return this.changeStatus(jobId, modifierId, {
            fromStatusId: job?.statusId ?? '',
            toStatusId: data.toStatusId,
          })
        })
      )
      return { jobIds: data.jobIds.toString() }
    } catch (error) {
      throw new InternalServerErrorException('Bulk change status failed')
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
    try {
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
        return { id: jobId, no: updatedJob.no }
      })
    } catch (error) {
      throw new InternalServerErrorException('Update members failed')
    }
  }

  async rescheduleJob(
    jobId: string,
    modifierId: string,
    data: RescheduleJobDto) {
    if (!jobId) {
      throw new Error('Job ID invalid')
    }
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Find job
        const job = await tx.job.findUnique({
          where: { id: jobId },
          select: { dueAt: true },
        })
        if (!job) throw new NotFoundException('Job not found')

        // 2. Update due at
        const updatedJob = await tx.job.update({
          where: { id: jobId },
          data: {
            dueAt: data.toDate,
          },
        })

        // 3. Create activity log
        await tx.jobActivityLog.create({
          data: {
            activityType: ActivityType.UpdateInformation,
            previousValue: data.fromDate,
            currentValue: data.toDate,
            fieldName: 'Due to',
            modifiedById: modifierId,
            jobId,
          },
        })

        return { id: jobId, no: updatedJob.no }
      })
    } catch (error) {
      throw new InternalServerErrorException('Reschedule job failed')
    }
  }

  async getAssignee(jobId: string) {
    if (!jobId) {
      throw new BadRequestException('Job ID invalid')
    } try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId },
        select: {
          assignee: true
        },
      })
      if (!job) throw new NotFoundException('Job not found')
      return {
        assignees: job.assignee,
        totalAssignees: job.assignee.length
      }
    } catch (error) {
      throw new InternalServerErrorException('Remove member failed')
    }
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
    try {

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
    } catch (error) {
      throw new InternalServerErrorException('Remove member failed')
    }
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
      throw new InternalServerErrorException('Delete job failed')
    }
  }

  private responseSchema(userRole: RoleEnum): typeof JobResponseDto | typeof JobStaffResponseDto {
    return userRole === RoleEnum.ADMIN ? JobResponseDto : JobStaffResponseDto
  }

  /**
 * Build Prisma filters from JobFiltersDto
 * Converts filter DTO into array of Prisma where conditions
 * 
 * @param filters - JobFiltersDto object containing filter criteria
 * @returns Array of Prisma JobWhereInput conditions
 * 
 * @example
 * // In your service:
 * const conditions = buildFilters(filters)
 * const where: Prisma.JobWhereInput = {
 *   AND: [...otherConditions, ...conditions]
 * }
 * await prisma.job.findMany({ where })
 */
  private buildFilters(filters?: JobFiltersDto): Prisma.JobWhereInput[] {
    if (!filters) return []

    const conditions: Prisma.JobWhereInput[] = []

    // Client Name filter
    if (filters.clientName?.length) {
      conditions.push({
        clientName: {
          in: filters.clientName,
        },
      })
    }

    // Job Type filter (by code)
    if (filters.type?.length) {
      conditions.push({
        type: {
          code: {
            in: filters.type,
          },
        },
      })
    }

    // Job Status filter (by code)
    if (filters.status?.length) {
      conditions.push({
        status: {
          code: {
            in: filters.status,
          },
        },
      })
    }

    // Assignee filter (by username) - many-to-many relation
    if (filters.assignee?.length) {
      conditions.push({
        assignee: {
          some: {
            username: {
              in: filters.assignee,
            },
          },
        },
      })
    }

    // Payment Channel filter (by code)
    if (filters.paymentChannel?.length) {
      conditions.push({
        paymentChannel: {
          displayName: {
            in: filters.paymentChannel,
          },
        },
      })
    }

    // Income Cost range filter
    if (filters.incomeCostMin || filters.incomeCostMax) {
      conditions.push({
        incomeCost: {
          ...(filters.incomeCostMin && {
            gte: parseFloat(filters.incomeCostMin),
          }),
          ...(filters.incomeCostMax && {
            lte: parseFloat(filters.incomeCostMax),
          }),
        },
      })
    }

    // Staff Cost range filter
    if (filters.staffCostMin || filters.staffCostMax) {
      conditions.push({
        staffCost: {
          ...(filters.staffCostMin && {
            gte: parseFloat(filters.staffCostMin),
          }),
          ...(filters.staffCostMax && {
            lte: parseFloat(filters.staffCostMax),
          }),
        },
      })
    }

    // Date range filters
    const dateRangeFilters: Array<{
      field: keyof Prisma.JobWhereInput
      from?: string
      to?: string
    }> = [
        {
          field: 'dueAt',
          from: filters.dueAtFrom,
          to: filters.dueAtTo,
        },
        {
          field: 'completedAt',
          from: filters.completedAtFrom,
          to: filters.completedAtTo,
        },
        {
          field: 'createdAt',
          from: filters.createdAtFrom,
          to: filters.createdAtTo,
        },
        {
          field: 'updatedAt',
          from: filters.updatedAtFrom,
          to: filters.updatedAtTo,
        },
        {
          field: 'finishedAt',
          from: filters.finishedAtFrom,
          to: filters.finishedAtTo,
        },
      ]

    // Apply date range filters
    dateRangeFilters.forEach(({ field, from, to }) => {
      if (from || to) {
        conditions.push({
          [field]: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        })
      }
    })

    return conditions
  }

  private buildQueryTab(tab?: JobTabEnum): Prisma.JobWhereInput {
    const today = dayjs().startOf('day').toDate()
    const dayAfterTomorrow = dayjs().add(2, 'day').startOf('day').toDate()

    const baseWhere: Prisma.JobWhereInput = {
      deletedAt: null,
    }

    const priorityFilter: Prisma.JobWhereInput = {
      ...baseWhere,
      AND: [
        {
          dueAt: {
            gt: today,
            lt: dayAfterTomorrow,
          },
        },
        {
          status: {
            NOT: {
              code: 'completed',
            },
          },
        },
        {
          status: {
            NOT: {
              code: 'finish',
            },
          },
        },
      ],
    }

    const activeFilter: Prisma.JobWhereInput = {
      ...baseWhere,
      dueAt: {
        gt: today,
      },
    }

    const completedFilter: Prisma.JobWhereInput = {
      ...baseWhere,
      status: {
        is: {
          code: 'completed',
        },
      },
    }

    const deliveredFilter: Prisma.JobWhereInput = {
      ...baseWhere,
      status: {
        is: {
          code: 'delivered',
        },
      },
    }

    const lateFilter: Prisma.JobWhereInput = {
      ...baseWhere,
      AND: [
        {
          dueAt: {
            lte: today,
          },
        },
        {
          status: {
            NOT: {
              code: 'completed',
            },
          },
        },
        {
          status: {
            NOT: {
              code: 'finish',
            },
          },
        },
      ],
    }

    const cancelledFilter: Prisma.JobWhereInput = {
      deletedAt: { not: null },
    }

    switch (tab) {
      case JobTabEnum.PRIORITY:
        return priorityFilter
      case JobTabEnum.ACTIVE:
        return activeFilter
      case JobTabEnum.COMPLETED:
        return completedFilter
      case JobTabEnum.DELIVERED:
        return deliveredFilter
      case JobTabEnum.LATE:
        return lateFilter
      case JobTabEnum.CANCELLED:
        return cancelledFilter
      default:
        return activeFilter
    }
  }

  private buildPermission(userRole: RoleEnum, userId: string): Prisma.JobWhereInput {
    if (userRole === RoleEnum.ADMIN) return {}
    return {
      assignee: { some: { id: userId } },
    }
  }

  private buildSearchBy(search?: string): Prisma.JobWhereInput {
    if (!search) return {}

    return {
      OR: [
        { no: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  private buildOrderBy(sort?: string): Prisma.JobOrderByWithRelationInput[] {
    if (!sort) return [{ createdAt: 'desc' }]

    const sortFields = sort.split(',')
    return sortFields.map((field) => {
      const isDescending = field.startsWith('-')
      const isAscending = field.startsWith('+')
      const fieldName = isDescending ? field.slice(1) : isAscending ? field.slice(1) : field
      const direction = isDescending ? 'desc' : 'asc'

      // Handle nested sorting if needed
      if (fieldName === 'status') {
        return { status: { displayName: direction } }
      }
      if (fieldName === 'type') {
        return { type: { displayName: direction } }
      }

      return { [fieldName]: direction }
    })
  }
}
