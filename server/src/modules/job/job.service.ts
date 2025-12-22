import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import {
    ActivityType,
    Job,
    JobDelivery,
    JobStatusSystemType,
    NotificationType,
    Prisma,
    RoleEnum,
} from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IMAGES, NOTIFICATION_CONTENT_TEMPLATES } from '../../utils'
import { renderTemplate } from '../../utils/_string'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { UserConfigService } from '../user-config/user-config.service'
import { CreateNotificationDto } from '../notification/dto/create-notification.dto'
import { NotificationService } from '../notification/notification.service'
import { UserService } from '../user/user.service'
import { BulkChangeStatusDto } from './dto/bulk-change-status.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { DeliverJobDto } from './dto/deliver-job.dto'
import { JobFiltersBuilder } from './dto/job-filters.dto'
import { JobQueryBuilder, JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto, JobStaffResponseDto } from './dto/job-response.dto'
import { JobSortBuilder } from './dto/job-sort.dto'
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import dayjs from 'dayjs'

@Injectable()
export class JobService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly userConfigService: UserConfigService,
        private readonly notificationService: NotificationService
    ) {}
    private readonly logger = new Logger(JobService.name)

    /**
     * Create a new job.
     */
    async create(createdById: string, data: CreateJobDto): Promise<Job> {
        const { assigneeIds, ...jobData } = data
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const statusId = await tx.jobStatus
                    .findUnique({ where: { order: 1 } })
                    .then((res) => res?.id ?? '')

                // 1. Create Job
                const job = await tx.job.create({
                    data: {
                        ...jobData,
                        createdById: createdById,
                        createdAt: new Date(),
                        incomeCost: parseFloat(data.incomeCost),
                        staffCost: parseFloat(data.staffCost),
                        priority: jobData.priority as Job['priority'],
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

                // 2. Log Activity: CreateJob
                await tx.jobActivityLog.create({
                    data: {
                        jobId: job.id,
                        modifiedById: createdById,
                        fieldName: 'Job Created',
                        activityType: ActivityType.CreateJob,
                        currentValue: job.no,
                        previousValue: '',
                    },
                })

                // 3. Send Notifications
                if (data.assigneeIds && data.assigneeIds.length > 0) {
                    await Promise.all(
                        data.assigneeIds.map(async (assigneeId) => {
                            const notification: CreateNotificationDto = {
                                userId: assigneeId,
                                title:
                                    'You have been assigned to job ' + job.no,
                                content:
                                    'Please review the job details and start working on it.',
                                type: NotificationType.JOB_UPDATE,
                                redirectUrl: renderTemplate(
                                    NOTIFICATION_CONTENT_TEMPLATES.jobDetailUrl,
                                    { jobNo: job.no }
                                ),
                                imageUrl: IMAGES.NOTIFICATION_DEFAULT_IMAGE,
                            }

                            return this.notificationService.send(notification)
                        })
                    )
                }

                return job
            })

            return plainToInstance(JobResponseDto, result, {
                excludeExtraneousValues: true,
            }) as unknown as Job
        } catch (error) {
            this.logger.error(
                'User ',
                createdById,
                ' - Create job failed',
                error.stack
            )
            throw new InternalServerErrorException('Create job failed')
        }
    }

    async togglePin(userId: string, jobId: string) {
        const existingPin = await this.prisma.pinnedJob.findUnique({
            where: {
                userId_jobId: { userId, jobId },
            },
        })

        if (existingPin) {
            await this.prisma.pinnedJob.delete({
                where: { userId_jobId: { userId, jobId } },
            })
            return { isPinned: false, message: 'Unpinned successfully' }
        } else {
            await this.prisma.pinnedJob.create({
                data: { userId, jobId },
            })
            return { isPinned: true, message: 'Pinned successfully' }
        }
    }

    async getWorkbenchData(
        userId: string,
        userRole: RoleEnum,
        {
            tab,
            hideFinishItems,
            page = 1,
            limit: take = 10,
            search,
            sort = ['displayName:asc'],
            isAll,
            ...filters
        }: JobQueryDto
    ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
        try {
            const jobInclude: Prisma.JobInclude = {
                type: { select: { displayName: true } },
                assignee: {
                    select: {
                        avatar: true,
                        displayName: true,
                        username: true,
                    },
                },
                status: {
                    select: {
                        displayName: true,
                        thumbnailUrl: true,
                        order: true,
                        systemType: true,
                        nextStatusOrder: true,
                        prevStatusOrder: true,
                        allowedRolesToSet: true,
                        code: true,
                        hexColor: true,
                    },
                },
                paymentChannel: { select: { displayName: true } },
            }

            const tabQuery = JobQueryBuilder.buildQueryTab(tab)
            const orderBy = JobSortBuilder.build(sort)
            const filtersQuery = JobFiltersBuilder.build(filters)
            const searchQuery = JobQueryBuilder.buildSearch(search, [
                'no',
                'displayName',
            ])

            const queryBuilder: Prisma.JobWhereInput = {
                AND: [
                    hideFinishItems
                        ? { status: { isNot: { systemType: 'TERMINATED' } } }
                        : {},
                    this.buildPermission(userRole, userId),
                    tabQuery,
                    filtersQuery,
                    searchQuery,
                ],
            }

            const userPinnedData = await this.prisma.pinnedJob.findMany({
                where: { userId },
                select: { jobId: true },
            })
            const pinnedJobIds = userPinnedData.map((item) => item.jobId)

            let resultData = []

            if (page === 1 && pinnedJobIds.length > 0) {
                const pinnedJobs = await this.prisma.job.findMany({
                    where: {
                        id: { in: pinnedJobIds },
                        ...queryBuilder,
                    },
                    include: jobInclude,
                    orderBy: { no: 'desc' },
                })

                const pinnedWithFlag = pinnedJobs.map((job) => ({
                    ...job,
                    isPinned: true,
                }))
                resultData = resultData.concat(pinnedWithFlag as never)
            }

            const regularTake =
                page === 1 && pinnedJobIds.length > 0
                    ? Math.max(0, take - pinnedJobIds.length)
                    : take
            const pinnedOffset = pinnedJobIds.length
            const regularSkip = isAll
                ? undefined
                : Math.max(0, (page - 1) * take - pinnedOffset)

            const [unpinnedJobs, totalUnpinnedJobs] = await Promise.all([
                this.prisma.job.findMany({
                    where: {
                        id: { notIn: pinnedJobIds },
                        ...queryBuilder,
                    },
                    orderBy,
                    take: isAll ? undefined : regularTake,
                    skip: regularSkip,
                    include: jobInclude,
                }),
                this.prisma.job.count({
                    where: {
                        id: { notIn: pinnedJobIds },
                        ...queryBuilder,
                    },
                }),
            ])

            const regularWithFlag = unpinnedJobs.map((job) => ({
                ...job,
                isPinned: false,
            }))
            resultData = resultData.concat(regularWithFlag as never)

            return {
                data: plainToInstance(
                    this.responseSchema(userRole),
                    resultData,
                    {
                        excludeExtraneousValues: true,
                    }
                ) as unknown as Job[],
                paginate: {
                    limit: isAll
                        ? totalUnpinnedJobs + pinnedJobIds.length
                        : take,
                    page: isAll ? 1 : page,
                    total: totalUnpinnedJobs + pinnedJobIds.length,
                    totalPages: isAll
                        ? 1
                        : Math.ceil(
                              (totalUnpinnedJobs + pinnedJobIds.length) / take
                          ),
                },
            }
        } catch (error) {
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }

    async findAll(
        userId: string,
        userRole: RoleEnum,
        query: JobQueryDto
    ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
        try {
            const {
                tab,
                hideFinishItems,
                page = 1,
                limit: take = 10,
                search,
                sort = 'isPinned:asc',
                isAll,
                ...filters
            } = query

            const filtersQuery = JobFiltersBuilder.build(filters)
            const orderBy = JobSortBuilder.build(sort)
            const tabQuery = JobQueryBuilder.buildQueryTab(tab)
            const searchQuery = JobQueryBuilder.buildSearch(search, [
                'no',
                'displayName',
            ])

            const queryBuilder: Prisma.JobWhereInput = {
                AND: [
                    this.buildPermission(userRole, userId),
                    hideFinishItems
                        ? { status: { isNot: { systemType: 'TERMINATED' } } }
                        : {},
                    tabQuery,
                    filtersQuery,
                    searchQuery,
                ],
            }

            const [data, total] = await Promise.all([
                this.prisma.job.findMany({
                    where: queryBuilder,
                    orderBy,
                    take: isAll ? undefined : take,
                    skip: isAll ? undefined : (page - 1) * take,
                    include: {
                        type: { select: { displayName: true } },
                        assignee: {
                            select: {
                                avatar: true,
                                displayName: true,
                                username: true,
                            },
                        },
                        status: {
                            select: {
                                displayName: true,
                                thumbnailUrl: true,
                                order: true,
                                systemType: true,
                                nextStatusOrder: true,
                                prevStatusOrder: true,
                                allowedRolesToSet: true,
                                code: true,
                                hexColor: true,
                            },
                        },
                        paymentChannel: { select: { displayName: true } },
                    },
                }),
                this.prisma.job.count({ where: queryBuilder }),
            ])

            if (data.length == 0) {
                this.logger.warn(`No jobs found for user ${userId}`)
            }

            const paginateResults = isAll
                ? {
                      limit: 0,
                      page: 1,
                      total: total ?? 0,
                      totalPages: Math.ceil(total / Number(take ?? 10)),
                  }
                : {
                      limit: take ?? 10,
                      page: page ?? 1,
                      total: total ?? 0,
                      totalPages: Math.ceil(total / Number(take ?? 10)),
                  }
            return {
                data: plainToInstance(this.responseSchema(userRole), data, {
                    excludeExtraneousValues: true,
                }) as unknown as Job[],
                paginate: paginateResults,
            }
        } catch (error) {
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }

    async search(
        userId: string,
        userRole: RoleEnum,
        keywords?: string
    ): Promise<Job[]> {
        try {
            const searchQuery = JobQueryBuilder.buildSearch(keywords, [
                'no',
                'displayName',
            ])
            const queryBuilder: Prisma.JobWhereInput = {
                AND: [this.buildPermission(userRole, userId), searchQuery],
            }

            const jobs = this.prisma.job.findMany({
                where: queryBuilder,
                orderBy: { displayName: 'asc' },
                include: { status: true },
            })

            return plainToInstance(this.responseSchema(userRole), jobs, {
                excludeExtraneousValues: true,
            }) as unknown as Job[]
        } catch (error) {
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }

    async findByJobNo(
        userId: string,
        userRole: RoleEnum,
        jobNo: string
    ): Promise<Job> {
        if (!jobNo) {
            throw new BadRequestException('Job no is invalid')
        }
        try {
            const job = await this.prisma.job.findFirst({
                where: {
                    AND: [
                        { no: jobNo },
                        this.buildPermission(userRole, userId),
                    ],
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
                                    avatar: true,
                                },
                            },
                        },
                    },
                    activityLog: {
                        include: { modifiedBy: true },
                    },
                },
            })

            if (!job) throw new NotFoundException('Job not found')

            return plainToInstance(this.responseSchema(userRole), job, {
                excludeExtraneousValues: true,
            }) as unknown as Job
        } catch (error) {
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get job by no failed')
        }
    }

    async getJobDeliver(jobId: string): Promise<JobDelivery[]> {
        if (!jobId) {
            throw new BadRequestException('Job id is invalid')
        }
        try {
            const jobDeliveries = await this.prisma.jobDelivery.findMany({
                where: { job: { id: jobId } },
                include: { user: true },
            })

            if (!jobDeliveries) throw new NotFoundException('Job not found')

            return jobDeliveries
        } catch (error) {
            this.logger.error(
                `Error finding job deliveries for user ${jobId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get job deliveries failed')
        }
    }

    async findJobsDueAt(
        userId: string,
        userRole: RoleEnum,
        isoDate: string
    ): Promise<Job[]> {
        if (!isoDate) {
            throw new BadRequestException('ISO date invalid')
        }

        const date = new Date(isoDate)
        const startOfDayUtc = new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                0,
                0,
                0,
                0
            )
        )
        const endOfDayUtc = new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                23,
                59,
                59,
                999
            )
        )
        try {
            const result = await this.prisma.job.findMany({
                where: {
                    AND: [
                        { dueAt: { gte: startOfDayUtc, lt: endOfDayUtc } },
                        this.buildPermission(userRole, userId),
                    ],
                },
                include: {
                    type: true,
                    assignee: { select: { avatar: true } },
                    createdBy: true,
                    paymentChannel: true,
                    status: true,
                    comments: true,
                    activityLog: { include: { modifiedBy: true } },
                },
            })

            if (!result) throw new NotFoundException('Jobs not found')

            return plainToInstance(this.responseSchema(userRole), result, {
                excludeExtraneousValues: true,
            }) as unknown as Job[]
        } catch (error) {
            throw new InternalServerErrorException('Get job by no failed')
        }
    }

    async getPendingPaymentJobs() {
        return this.prisma.job.findMany({
            where: {
                status: { systemType: 'COMPLETED' },
                isPaid: false,
                deletedAt: null,
            },
            include: {
                status: {
                    select: {
                        id: true,
                        displayName: true,
                        code: true,
                        hexColor: true,
                    },
                },
                type: { select: { displayName: true, code: true } },
                assignee: {
                    select: {
                        id: true,
                        displayName: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
            orderBy: { completedAt: 'asc' }, // Oldest first (pay them first!)
        })
    }

    async getPendingDeliverJobs(userId: string, userRole: RoleEnum) {
        return this.prisma.job.findMany({
            where: {
                AND: [
                    this.buildPermission(userRole, userId),
                    {
                        status: {
                            code: { in: ['in-progress', 'revision'] },
                        },
                    },
                    { deletedAt: null },
                ],
            },
            orderBy: { dueAt: 'asc' },
            include: {
                status: {
                    select: {
                        id: true,
                        displayName: true,
                        code: true,
                        hexColor: true,
                    },
                },
                type: { select: { displayName: true, code: true } },
                assignee: {
                    select: {
                        id: true,
                        displayName: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
        })
    }

    async deliverJob(userId: string, jobId: string, dto: DeliverJobDto) {
        return this.prisma.$transaction(async (tx) => {
            const reviewStatus = await tx.jobStatus.findFirst({
                where: { systemType: 'WAIT_REVIEW' },
            })
            if (!reviewStatus)
                throw new Error("System Status 'WAIT_REVIEW' missing")

            const currentJob = await tx.job.findUnique({
                where: { id: jobId },
                include: { status: true },
            })

            // 1. Create Delivery
            const delivery = await tx.jobDelivery.create({
                data: {
                    jobId,
                    userId,
                    note: dto.note,
                    link: dto.link,
                    files: dto.files,
                    status: 'PENDING',
                },
            })

            // 2. Update Job
            const jobUpdated = await tx.job.update({
                where: { id: jobId },
                data: { statusId: reviewStatus.id },
                include: { status: true },
            })

            // 3. Log Activity: DeliverJob
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    modifiedById: userId,
                    fieldName: 'Delivery',
                    activityType: ActivityType.DeliverJob,
                    previousValue: currentJob?.status.code,
                    currentValue: reviewStatus.code,
                    notes: 'Job delivered by staff',
                },
            })

            // 4. Notifications
            const admins = await tx.user.findMany({ where: { role: 'ADMIN' } })
            if (admins.length > 0) {
                await tx.notification.createMany({
                    data: admins.map((admin) => ({
                        userId: admin.id,
                        senderId: userId,
                        title: 'New Job Delivery',
                        content: `Staff member has delivered job. Check delivery #${jobUpdated.no}`,
                        type: 'JOB_UPDATE',
                        redirectUrl: `/admin/mgmt/jobs/${jobUpdated.no}?tab=deliveries`,
                    })),
                })
            }

            return delivery
        })
    }

    async reviewDeliveryActions(
        adminId: string,
        deliveryId: string,
        isApproved: boolean,
        feedback?: string
    ) {
        return this.prisma.$transaction(async (tx) => {
            const delivery = await tx.jobDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: isApproved ? 'APPROVED' : 'REJECTED',
                    adminFeedback: feedback,
                },
                include: { job: { include: { status: true } } },
            })

            let nextStatusCode = isApproved ? 'completed' : 'revision'
            const nextStatus = await tx.jobStatus.findUnique({
                where: { code: nextStatusCode },
            })

            const jobUpdated = await tx.job.update({
                where: { id: delivery.jobId },
                data: {
                    statusId: nextStatus?.id,
                    completedAt: isApproved ? new Date() : undefined,
                },
                select: { no: true },
            })

            // Log Activity: ChangeStatus
            await tx.jobActivityLog.create({
                data: {
                    jobId: delivery.jobId,
                    modifiedById: adminId,
                    fieldName: 'status',
                    activityType: ActivityType.ChangeStatus,
                    previousValue: delivery.job.status.code,
                    currentValue: nextStatusCode,
                    notes: isApproved
                        ? 'Delivery Approved'
                        : `Delivery Rejected: ${feedback}`,
                },
            })

            if (isApproved) {
                // Notify Accounting
                const accountants = await tx.user.findMany({
                    where: { role: 'ACCOUNTING' },
                })
                await tx.notification.createMany({
                    data: accountants.map((acc) => ({
                        userId: acc.id,
                        title: 'Payment Pending',
                        content: `Job #${jobUpdated.no} is completed. Please verify payment.`,
                        type: 'JOB_UPDATE',
                        redirectUrl: `/financial/pending-payouts`,
                    })),
                })
            }

            await tx.notification.create({
                data: {
                    userId: delivery.userId,
                    senderId: adminId,
                    title: isApproved
                        ? 'Delivery Approved'
                        : 'Delivery Rejected',
                    content: isApproved
                        ? `Great job! Your delivery for ${delivery.job.displayName} was approved.`
                        : `Delivery rejected. Feedback: ${feedback}`,
                    type: isApproved ? 'SUCCESS' : 'WARNING',
                    redirectUrl: `/jobs/${jobUpdated.no}`,
                },
            })

            return delivery
        })
    }

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
            throw new InternalServerErrorException('Get job by id failed')
        }
    }

    async update(
        modifierId: string,
        jobId: string,
        data: UpdateJobDto
    ): Promise<{ id: string; no: string }> {
        try {
            const {
                typeId,
                paymentChannelId,
                incomeCost,
                staffCost,
                attachmentUrls,
                ...cleanData
            } = data

            const updated = await this.prisma.$transaction(async (tx) => {
                const currentJob = await tx.job.findUnique({
                    where: { id: jobId },
                })

                if (!currentJob) throw new NotFoundException('Job not found')

                const updateJob = await tx.job.update({
                    where: { id: jobId },
                    data: {
                        ...cleanData,
                        incomeCost:
                            incomeCost !== undefined
                                ? Number(incomeCost)
                                : undefined,
                        staffCost:
                            staffCost !== undefined
                                ? Number(staffCost)
                                : undefined,
                        typeId: typeId,
                        paymentChannelId: paymentChannelId,
                        attachmentUrls: attachmentUrls
                            ? Array.isArray(attachmentUrls)
                                ? attachmentUrls
                                : [attachmentUrls]
                            : undefined,
                    },
                    select: { id: true, no: true },
                })

                // Log Activity: UpdateInformation
                await tx.jobActivityLog.create({
                    data: {
                        jobId: jobId,
                        previousValue: JSON.stringify({
                            incomeCost: currentJob.incomeCost,
                            staffCost: currentJob.staffCost,
                            paymentChannelId: currentJob.paymentChannelId,
                            displayName: currentJob.displayName,
                        }),
                        currentValue: JSON.stringify(data),
                        modifiedById: modifierId,
                        fieldName: 'Job Information',
                        activityType: ActivityType.UpdateInformation,
                    },
                })

                return updateJob.no
            })

            return { id: jobId, no: updated }
        } catch (error) {
            console.error('Update Job Error:', error)
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Update job failed')
        }
    }
    async markPaid(
        jobId: string,
        modifierId: string
    ): Promise<{ id: string; no: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')

        return await this.prisma.$transaction(async (tx) => {
            // 1. Fetch Job and Modifier (User) in parallel or combined to save time
            const [job, modifier] = await Promise.all([
                tx.job.findUnique({
                    where: { id: jobId },
                    select: {
                        id: true,
                        no: true,
                        isPaid: true,
                        assignee: { select: { id: true } },
                        status: { select: { systemType: true } },
                    },
                }),
                tx.user.findUnique({
                    where: { id: modifierId },
                    select: { displayName: true },
                }),
            ])

            if (!job) throw new NotFoundException('Job not found')
            if (job.isPaid)
                throw new BadRequestException('Job has already been paid')
            if (!modifier)
                throw new NotFoundException('Modifier user not found')

            // 2. Get the "Finished" status ID
            // Using findFirst because systemType is an enum, not a unique ID
            const finishStatus = await tx.jobStatus.findFirst({
                where: { systemType: JobStatusSystemType.TERMINATED },
                select: { id: true },
            })

            if (!finishStatus) {
                throw new InternalServerErrorException(
                    'System status TERMINATED not configured in database'
                )
            }

            // 3. Prepare Update Data
            // If job is in COMPLETED (Staff done), move to TERMINATED (Paid & Archive)
            // If job is in any other status, just mark as paid but stay in current status
            const now = new Date()
            const updateData: Prisma.JobUpdateInput = {
                isPaid: true,
                paidAt: now,
            }

            if (job.status.systemType === JobStatusSystemType.COMPLETED) {
                updateData.status = { connect: { id: finishStatus.id } }
                updateData.finishedAt = now
            }

            // 4. Execute Job Update
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: updateData,
                select: { id: true, no: true },
            })

            // 5. Log Activity
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    previousValue: 'Unpaid',
                    currentValue: 'Paid',
                    modifiedById: modifierId,
                    fieldName: 'Payment Status',
                    activityType: ActivityType.MarkPaid,
                    notes: `Payment confirmed by ${modifier.displayName}`,
                },
            })

            // 6. Notify Assignees (Non-blocking notification send)
            if (job.assignee?.length > 0) {
                const notifications = job.assignee.map((assignee) => {
                    const dto: CreateNotificationDto = {
                        userId: assignee.id,
                        title: renderTemplate(
                            NOTIFICATION_CONTENT_TEMPLATES
                                .notifyAssigneeWhenPaid.title,
                            { jobNo: job.no }
                        ),
                        content: renderTemplate(
                            NOTIFICATION_CONTENT_TEMPLATES
                                .notifyAssigneeWhenPaid.content,
                            {
                                jobNo: job.no,
                                paidBy: modifier.displayName,
                            }
                        ),
                        type: NotificationType.JOB_UPDATE,
                        redirectUrl: renderTemplate(
                            NOTIFICATION_CONTENT_TEMPLATES
                                .notifyAssigneeWhenPaid.url,
                            { jobNo: job.no }
                        ),
                        imageUrl: IMAGES.NOTIFICATION_DEFAULT_IMAGE,
                    }
                    return this.notificationService.send(dto)
                })

                // We don't necessarily need to await these inside the transaction
                // if your notification service is async/queue-based,
                // but for consistency we keep them in the flow.
                await Promise.all(notifications)
            }

            return { id: updatedJob.id, no: updatedJob.no }
        })
    }

    async getDueInMonth(
        month: number,
        year: number,
        userId: string,
        userRole: RoleEnum
    ) {
        // 1. Create a Day.js object for the start of the month
        // Note: Day.js months are 0-indexed (0 = Jan), so we subtract 1
        const startOfMonth = dayjs()
            .year(year)
            .month(month - 1)
            .startOf('month')
        const endOfMonth = startOfMonth.endOf('month')

        return this.prisma.job.findMany({
            where: {
                AND: [
                    // Permission check: Staff only see their own, Admins see all
                    this.buildPermission(userRole, userId),
                    {
                        dueAt: {
                            gte: startOfMonth.toDate(),
                            lte: endOfMonth.toDate(),
                        },
                    },
                    { deletedAt: null }, // Exclude deleted jobs
                ],
            },
            include: {
                status: true,
                type: true,
                assignee: {
                    select: {
                        displayName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                dueAt: 'asc',
            },
        })
    }

    async changeStatus(
        jobId: string,
        modifierId: string,
        data: ChangeStatusDto
    ): Promise<{ id: string; no: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')

        return await this.prisma.$transaction(async (tx) => {
            const job = await tx.job.findUnique({
                where: { id: jobId },
                include: { status: true },
            })
            if (!job) throw new NotFoundException('Job not found')

            const targetStatus = await tx.jobStatus.findUnique({
                where: { code: data.newStatus },
            })
            if (!targetStatus)
                throw new NotFoundException('Target status not found')

            const getUpdateData = () => {
                let base = { statusId: targetStatus.id }
                if (targetStatus.systemType === JobStatusSystemType.COMPLETED) {
                    return Object.assign(base, { completedAt: new Date() })
                }
                if (
                    targetStatus.systemType === JobStatusSystemType.TERMINATED
                ) {
                    if (
                        job.status.systemType !== JobStatusSystemType.COMPLETED
                    ) {
                        return Object.assign(base, {
                            completedAt: new Date(),
                            finishedAt: new Date(),
                            isPaid: true,
                        })
                    } else {
                        return Object.assign(base, {
                            finishedAt: new Date(),
                            isPaid: true,
                        })
                    }
                }
                return base
            }

            const updateData = getUpdateData()
            const updateJob = await tx.job.update({
                where: { id: jobId },
                data: updateData,
            })

            // Log Activity: ChangeStatus
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    previousValue: data.currentStatus,
                    currentValue: data.newStatus,
                    modifiedById: modifierId,
                    fieldName: 'status',
                    activityType: ActivityType.ChangeStatus,
                },
            })

            const assignees = await tx.job.findUnique({
                where: { id: jobId },
                select: { assignee: true },
            })

            if (assignees && assignees.assignee.length > 0) {
                await Promise.all(
                    assignees.assignee.map(async (assignee) => {
                        const notification: CreateNotificationDto = {
                            userId: assignee.id,
                            title: 'Job Status Changed',
                            content: renderTemplate(
                                NOTIFICATION_CONTENT_TEMPLATES
                                    .notifyAssigneeWhenChangeStatus.content,
                                {
                                    jobNo: job.no,
                                    newStatus: targetStatus.displayName,
                                }
                            ),
                            type: NotificationType.JOB_UPDATE,
                            redirectUrl: renderTemplate(
                                NOTIFICATION_CONTENT_TEMPLATES
                                    .notifyAssigneeWhenChangeStatus.url,
                                { jobNo: job.no }
                            ),
                            imageUrl: targetStatus.thumbnailUrl ?? undefined,
                        }
                        return this.notificationService.send(notification)
                    })
                )
            }
            return { id: jobId, no: updateJob.no }
        })
    }

    async bulkChangeStatus(
        modifierId: string,
        data: BulkChangeStatusDto
    ): Promise<{ jobIds: string }> {
        try {
            await Promise.all(
                data.jobIds.map(async (jobId) => {
                    const job = await this.prisma.job.findUnique({
                        where: { id: jobId },
                        select: { statusId: true },
                    })

                    return this.changeStatus(jobId, modifierId, {
                        currentStatus: job?.statusId ?? '',
                        newStatus: data.toStatusId,
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
        data: UpdateJobMembersDto
    ): Promise<{ id: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')
        try {
            return await this.prisma.$transaction(async (tx) => {
                const job = await tx.job.findUnique({
                    where: { id: jobId },
                    select: { statusId: true, no: true },
                })
                if (!job) throw new NotFoundException('Job not found')

                const updatedJob = await tx.job.update({
                    where: { id: jobId },
                    include: { status: true },
                    data: {
                        ...(data.updateMemberIds &&
                            JSON.parse(data.updateMemberIds).length > 0 && {
                                assignee: {
                                    connect: JSON.parse(
                                        data.updateMemberIds
                                    ).map((id: string) => ({ id })),
                                },
                            }),
                    },
                })

                // Log Activity: AssignMember
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

                const updateMemberIdsArr: string[] = data.updateMemberIds
                    ? JSON.parse(data.updateMemberIds)
                    : []
                if (updateMemberIdsArr.length > 0) {
                    await Promise.all(
                        updateMemberIdsArr.map(async (assigneeId) => {
                            const notification: CreateNotificationDto = {
                                userId: assigneeId,
                                title:
                                    'You have been assigned to job ' + job.no,
                                content:
                                    'Please review the job details and start working on it.',
                                type: NotificationType.JOB_UPDATE,
                                redirectUrl: renderTemplate(
                                    NOTIFICATION_CONTENT_TEMPLATES.jobDetailUrl,
                                    { jobNo: job.no }
                                ),
                                imageUrl:
                                    updatedJob.status.thumbnailUrl ??
                                    IMAGES.NOTIFICATION_DEFAULT_IMAGE,
                            }
                            return this.notificationService.send(notification)
                        })
                    )
                }
                return { id: jobId, no: updatedJob.no }
            })
        } catch (error) {
            throw new InternalServerErrorException('Update members failed')
        }
    }

    async rescheduleJob(
        jobId: string,
        modifierId: string,
        data: RescheduleJobDto
    ) {
        if (!jobId) throw new Error('Job ID invalid')
        try {
            return await this.prisma.$transaction(async (tx) => {
                const job = await tx.job.findUnique({
                    where: { id: jobId },
                    select: { dueAt: true },
                })
                if (!job) throw new NotFoundException('Job not found')

                const updatedJob = await tx.job.update({
                    where: { id: jobId },
                    data: { dueAt: data.toDate },
                })

                // Log Activity: UpdateInformation
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

    async removeMember(
        jobId: string,
        modifierId: string,
        memberId: string
    ): Promise<{ id: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')
        if (!memberId) throw new BadRequestException('Member ID invalid')
        try {
            return await this.prisma.$transaction(async (tx) => {
                const job = await tx.job.findUnique({
                    where: { id: jobId },
                    select: {
                        statusId: true,
                        assignee: { select: { id: true } },
                    },
                })
                if (!job) throw new NotFoundException('Job not found')

                const prevMemberIds = job.assignee.map((m) => m.id)
                if (!prevMemberIds.includes(memberId)) {
                    throw new NotFoundException(
                        'Member not assigned to this job'
                    )
                }

                const updated = await tx.job.update({
                    where: { id: jobId },
                    data: {
                        assignee: { disconnect: { id: memberId } },
                    },
                })

                const updatedMemberIds = prevMemberIds.filter(
                    (id) => id !== memberId
                )

                // Log Activity: UnassignMember
                await tx.jobActivityLog.create({
                    data: {
                        activityType: ActivityType.UnassignMember,
                        previousValue: JSON.stringify(prevMemberIds),
                        currentValue: JSON.stringify(updatedMemberIds),
                        fieldName: 'Assignee',
                        modifiedById: modifierId,
                        jobId,
                    },
                })

                return { id: jobId, no: updated.no }
            })
        } catch (error) {
            throw new InternalServerErrorException('Remove member failed')
        }
    }

    async getAssignee(jobId: string) {
        if (!jobId) {
            throw new BadRequestException('Job ID invalid')
        }
        try {
            const job = await this.prisma.job.findUnique({
                where: { id: jobId },
                select: {
                    assignee: true,
                },
            })
            if (!job) throw new NotFoundException('Job not found')
            return {
                assignees: job.assignee,
                totalAssignees: job.assignee.length,
            }
        } catch (error) {
            throw new InternalServerErrorException('Remove member failed')
        }
    }

    /**
     * Delete job by ID (soft delete: set deletedAt).
     */
    async delete(jobId: string, modifierId: string): Promise<{ id: string }> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const job = await tx.job.findUnique({ where: { id: jobId } })
                if (!job) throw new NotFoundException('Job not found')

                const deleted = await tx.job.update({
                    where: { id: jobId },
                    data: { deletedAt: new Date() },
                })

                // Log Activity: DeleteJob
                await tx.jobActivityLog.create({
                    data: {
                        jobId: jobId,
                        modifiedById: modifierId,
                        fieldName: 'Deleted',
                        activityType: ActivityType.DeleteJob,
                        previousValue: 'Active',
                        currentValue: 'Deleted',
                    },
                })

                return { id: deleted.id }
            })
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Delete job failed')
        }
    }

    private responseSchema(
        userRole: RoleEnum
    ): typeof JobResponseDto | typeof JobStaffResponseDto {
        return userRole === RoleEnum.ADMIN
            ? JobResponseDto
            : JobStaffResponseDto
    }

    private buildPermission(
        userRole: RoleEnum,
        userId: string
    ): Prisma.JobWhereInput {
        if (userRole === RoleEnum.ADMIN) return {}
        return {
            assignee: { some: { id: userId } },
        }
    }
}
