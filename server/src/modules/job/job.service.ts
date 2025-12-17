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
    JobStatusSystemType,
    NotificationType,
    Prisma,
    RoleEnum,
} from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { userConfigCode } from '../../common/constants/user-config-code.constant'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { UserConfigService } from '../user-config/user-config.service'
import { CreateNotificationDto } from '../notification/dto/create-notification.dto'
import { NotificationService } from '../notification/notification.service'
import { UserService } from '../user/user.service'
import { BulkChangeStatusDto } from './dto/bulk-change-status.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { JobFiltersBuilder } from './dto/job-filters.dto'
import { JobQueryBuilder, JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto, JobStaffResponseDto } from './dto/job-response.dto'
import { JobSortBuilder } from './dto/job-sort.dto'
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobTabEnum } from './enums/job-tab.enum'
import { renderTemplate } from '../../utils/_string'
import { IMAGES, NOTIFICATION_CONTENT_TEMPLATES } from '../../utils'

@Injectable()
export class JobService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly userConfigService: UserConfigService,
        private readonly notificationService: NotificationService
    ) { }
    private readonly logger = new Logger(JobService.name)

    /**
     * Create a new job.
     */
    async create(createdById: string, data: CreateJobDto): Promise<Job> {
        const { assigneeIds, ...jobData } = data
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const statusId = await this.prisma.jobStatus
                    .findUnique({ where: { order: 1 } })
                    .then((res) => res?.id ?? '')

                const job = await tx.job.create({
                    data: {
                        ...jobData,
                        createdById: createdById,
                        createdAt: new Date(),
                        incomeCost: parseFloat(data.incomeCost),
                        staffCost: parseFloat(data.staffCost),
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

                if (data.assigneeIds && data.assigneeIds.length > 0) {
                    await Promise.all(
                        data.assigneeIds.map(async (assigneeId) => {
                            const notification: CreateNotificationDto = {
                                userId: assigneeId,
                                title: 'You have been assigned to job ' + job.no,
                                content: "Please review the job details and start working on it.",
                                type: NotificationType.JOB_UPDATE,
                                redirectUrl: renderTemplate(NOTIFICATION_CONTENT_TEMPLATES.jobDetailUrl, { jobNo: job.no }),
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
        // Check xem đã pin chưa
        const existingPin = await this.prisma.pinnedJob.findUnique({
            where: {
                userId_jobId: { userId, jobId },
            },
        });

        if (existingPin) {
            // Nếu có rồi -> Xóa (Unpin)
            await this.prisma.pinnedJob.delete({
                where: { userId_jobId: { userId, jobId } },
            });
            return { isPinned: false, message: 'Unpinned successfully' };
        } else {
            // Nếu chưa có -> Tạo mới (Pin)
            await this.prisma.pinnedJob.create({
                data: { userId, jobId },
            });
            return { isPinned: true, message: 'Pinned successfully' };
        }
    }

    /**
     * Specification get data for WORKBENCH page
     */
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
                type: {
                    select: {
                        displayName: true,
                    },
                },
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
                paymentChannel: {
                    select: {
                        displayName: true,
                    },
                },
            }
            // 1. Build Advanced Filters (using your new Builder)
            const tabQuery = JobQueryBuilder.buildQueryTab(tab)
            const orderBy = JobSortBuilder.build(sort)
            const filtersQuery = JobFiltersBuilder.build(filters)
            const searchQuery = JobQueryBuilder.buildSearch(search, [
                'no',
                'displayName',
            ])

            const queryBuilder: Prisma.JobWhereInput = {
                AND: [
                    // Custom Toggle: Hide Finished Items
                    hideFinishItems
                        ? { status: { isNot: { systemType: 'TERMINATED' } } }
                        : {},

                    // Apply Permissions (Your existing logic)
                    this.buildPermission(userRole, userId),
                    // Apply Built Filters (Client, Status, Date Ranges, etc.)
                    tabQuery,
                    filtersQuery,
                    searchQuery,
                ],
            }

            // Lấy danh sách ID các job mà user này đã Pin
            const userPinnedData = await this.prisma.pinnedJob.findMany({
                where: { userId },
                select: { jobId: true },
            });
            const pinnedJobIds = userPinnedData.map((item) => item.jobId);

            let resultData = [];

            // Nếu là trang 1, Query lấy chi tiết các Job đã Pin đưa lên đầu
            if (page === 1 && pinnedJobIds.length > 0) {
                const pinnedJobs = await this.prisma.job.findMany({
                    where: {
                        id: {
                            in: pinnedJobIds,
                        },
                        ...queryBuilder,
                    },
                    include: jobInclude,
                    orderBy: { no: 'desc' }, // Sort trong nhóm Pin
                });

                // Gán cờ isPinned = true
                const pinnedWithFlag = pinnedJobs.map((job) => ({ ...job, isPinned: true }));
                resultData = resultData.concat(pinnedWithFlag as never);
            }

            // Lấy các Job thường (LOẠI TRỪ Job đã Pin)
            // Dùng pinnedJobIds để loại trừ -> Đảm bảo không trùng

            // --- XỬ LÝ REGULAR JOBS ---

            // 5. Tính toán Skip & Take chuẩn xác để không bị mất dữ liệu
            // Nếu Page 1 đã lấy X job pin, thì job thường chỉ lấy (Limit - X).
            // Sang Page 2, ta phải tính offset dựa trên số lượng job pin đã hiển thị ở Page 1.

            // Số lượng job thường cần lấy ở page hiện tại
            // Nếu Page 1: Lấy (Limit - Số lượng Pin). Nếu Limit < Số lượng Pin thì lấy 0.
            // Nếu Page > 1: Lấy đúng Limit.
            const regularTake = (page === 1 && pinnedJobIds.length > 0)
                ? Math.max(0, take - pinnedJobIds.length)
                : take;
            const pinnedOffset = pinnedJobIds.length;
            // Số lượng job thường cần bỏ qua
            // Công thức: (Page - 1) * Limit - (Số lượng Pin bù vào Page 1)
            // VD: Limit 10, Pin 2. 
            // Page 1: Skip 0. Take 8 regular.
            // Page 2: Skip (1 * 10) - 2 = 8. (Bắt đầu lấy từ regular thứ 9). Chính xác.
            const regularSkip = isAll
                ? undefined
                : Math.max(0, (page - 1) * take - pinnedOffset);
            // 5. Execute Query
            const [unpinnedJobs, totalUnpinnedJobs] = await Promise.all([
                this.prisma.job.findMany({
                    where: {
                        id: {
                            notIn: pinnedJobIds,
                        },
                        ...queryBuilder,
                    },
                    orderBy,
                    // If isAll is true, set take/skip to undefined (Prisma ignores them)
                    take: isAll ? undefined : regularTake,
                    skip: regularSkip,
                    include: jobInclude
                }),
                this.prisma.job.count({
                    where: {
                        id: {
                            notIn: pinnedJobIds,
                        },
                        ...queryBuilder,
                    }
                }),
            ])
            // Gán cờ isPinned = false
            const regularWithFlag = unpinnedJobs.map((job) => ({ ...job, isPinned: false }));
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
                    limit: isAll ? totalUnpinnedJobs + pinnedJobIds.length : take,
                    page: isAll ? 1 : page,
                    total: totalUnpinnedJobs + pinnedJobIds.length,
                    totalPages: isAll ? 1 : Math.ceil((totalUnpinnedJobs + pinnedJobIds.length) / take),
                },
            }
        } catch (error) {
            // Log the actual error to your terminal for debugging
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }



    /**
     * Find all jobs with relations.
     */
    async findAll(
        userId: string,
        userRole: RoleEnum,
        query: JobQueryDto
    ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
        try {
            // 1. Extract query params
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

            // 2. Build Advanced Filters (using your new Builder)
            const filtersQuery = JobFiltersBuilder.build(filters)

            // 3. Build Sorting (using your new Builder)
            const orderBy = JobSortBuilder.build(sort)

            // 4. Build Tab
            const tabQuery = JobQueryBuilder.buildQueryTab(tab)

            // 5. Build search
            const searchQuery = JobQueryBuilder.buildSearch(search, [
                'no',
                'displayName',
            ])

            // 6. Construct the Main WHERE Clause
            const queryBuilder: Prisma.JobWhereInput = {
                AND: [
                    // Apply Permissions (Your existing logic)
                    this.buildPermission(userRole, userId),

                    // Custom Toggle: Hide Finished Items
                    hideFinishItems
                        ? { status: { isNot: { systemType: 'TERMINATED' } } }
                        : {},

                    // Apply Built Filters (Client, Status, Date Ranges, etc.)
                    tabQuery,
                    filtersQuery,
                    searchQuery,
                ],
            }

            // 5. Execute Query
            const [data, total] = await Promise.all([
                this.prisma.job.findMany({
                    where: queryBuilder,
                    orderBy,
                    // If isAll is true, set take/skip to undefined (Prisma ignores them)
                    take: isAll ? undefined : take, // Uses fallback from DTO (10)
                    skip: isAll ? undefined : (page - 1) * take, // Uses getter from DTO
                    include: {
                        type: {
                            select: {
                                displayName: true,
                            },
                        },
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
                        paymentChannel: {
                            select: {
                                displayName: true,
                            },
                        },
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
            // Log the actual error to your terminal for debugging
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }


    /**
     * Search job
     */
    async search(
        userId: string,
        userRole: RoleEnum,
        keywords?: string
    ): Promise<Job[]> {
        try {
            // 1. Build search
            const searchQuery = JobQueryBuilder.buildSearch(keywords, [
                'no',
                'displayName',
            ])

            // 6. Construct the Main WHERE Clause
            const queryBuilder: Prisma.JobWhereInput = {
                AND: [
                    // Apply Permissions (Your existing logic)
                    this.buildPermission(userRole, userId),
                    searchQuery,
                ],
            }

            // 5. Execute Query
            const jobs = this.prisma.job.findMany({
                where: queryBuilder,
                orderBy: {
                    displayName: 'asc',
                },
                include: {
                    status: true,
                },
            })

            return plainToInstance(this.responseSchema(userRole), jobs, {
                excludeExtraneousValues: true,
            }) as unknown as Job[]
        } catch (error) {
            // Log the actual error to your terminal for debugging
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get jobs failed')
        }
    }

    /**
     * Find job by ID.
     */
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
            this.logger.error(
                `Error finding jobs for user ${userId}`,
                error.stack
            )
            throw new InternalServerErrorException('Get job by no failed')
        }
    }

    /**
     * Find job by deadline.
     */
    async findJobsDueAt(
        userId: string,
        userRole: RoleEnum,
        isoDate: string
    ): Promise<Job[]> {
        if (!isoDate) {
            throw new BadRequestException('ISO date invalid')
        }

        const date = new Date(isoDate) // e.g. "2025-06-12"
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
                    assignee: {
                        select: {
                            avatar: true
                        }
                    },
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
            throw new InternalServerErrorException('Get job by no failed')
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
            throw new InternalServerErrorException('Get job by id failed')
        }
    }

    /**
     * Update job by ID.
     */
    async update(
        modifierId: string,
        jobId: string,
        data: UpdateJobDto
    ): Promise<{ id: string; no: string }> {
        try {
            // 1. Bóc tách TẤT CẢ các field cần xử lý đặc biệt ra khỏi 'restData'
            // Để đảm bảo 'cleanData' chỉ chứa các field string đơn giản (tên, mô tả...)
            const {
                typeId,
                paymentChannelId,
                incomeCost,
                staffCost,
                attachmentUrls,
                ...cleanData // Chỉ còn lại: displayName, description, clientName...
            } = data

            const updated = await this.prisma.$transaction(async (tx) => {
                // 1. Find job (Lấy dữ liệu cũ để ghi log)
                const currentJob = await tx.job.findUnique({
                    where: { id: jobId },
                })

                if (!currentJob) throw new NotFoundException('Job not found')

                // 2. Update job
                const updateJob = await tx.job.update({
                    where: { id: jobId },
                    data: {
                        // Spread các field string an toàn (không chứa incomeCost/typeId...)
                        ...cleanData,

                        // Xử lý convert String -> Number an toàn
                        // Chỉ update nếu user có gửi lên (check undefined)
                        incomeCost:
                            incomeCost !== undefined
                                ? Number(incomeCost)
                                : undefined,
                        staffCost:
                            staffCost !== undefined
                                ? Number(staffCost)
                                : undefined,

                        // Xử lý Foreign Key (Dùng Scalar ID trực tiếp, KHÔNG dùng connect)
                        typeId: typeId,
                        paymentChannelId: paymentChannelId,

                        // Xử lý Array
                        attachmentUrls: attachmentUrls
                            ? Array.isArray(attachmentUrls)
                                ? attachmentUrls
                                : [attachmentUrls]
                            : undefined,
                    },
                    select: {
                        id: true,
                        no: true,
                    },
                })

                // 3. Create activity log
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
                        activityType: ActivityType.UpdateInformation, // Đảm bảo khớp Enum
                    },
                })

                return updateJob.no
            })

            return { id: jobId, no: updated }
        } catch (error) {
            console.error('Update Job Error:', error) // Log để debug
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Update job failed')
        }
    }

    async markPaid(
        jobId: string,
        modifierId: string
    ): Promise<{ id: string; no: string }> {
        if (!jobId) {
            throw new BadRequestException('Job ID invalid')
        }

        return await this.prisma.$transaction(async (tx) => {
            // 1. Tìm Job để check trạng thái hiện tại
            const job = await tx.job.findUnique({
                where: { id: jobId },
                select: {
                    id: true, no: true, isPaid: true, assignee: {
                        select: {
                            id: true
                        }
                    },
                    status: {
                        select: {
                            systemType: true
                        }
                    }
                },
            })

            const modifier = await tx.user.findUnique({
                where: { id: modifierId },
                select: {
                    displayName: true
                },
            })


            if (!job) throw new NotFoundException('Job not found')

            // 2. Check Logic: Nếu đã trả rồi -> Throw lỗi
            if (job.isPaid) {
                throw new BadRequestException('Job has already been paid')
            }

            const finishStatus = await tx.jobStatus.findFirst({
                where: { systemType: JobStatusSystemType.TERMINATED },
                select: { id: true }
            })

            // 3. Update: Mark to Paid
            const updateData = job.status.systemType === JobStatusSystemType.COMPLETED ? {
                isPaid: true,
                paidAt: new Date(),
                statusId: finishStatus?.id,
                finishedAt: new Date()
            } : {
                isPaid: true,
                paidAt: new Date(),
            }

            const updateJob = await tx.job.update({
                where: { id: jobId },
                data: updateData
            })

            // 4. Ghi log
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    previousValue: 'false',
                    currentValue: 'true',
                    modifiedById: modifierId,
                    fieldName: 'mark paid',
                    activityType: ActivityType.UpdateInformation,
                },
            })


            if (job.assignee && job.assignee.length > 0) {
                await Promise.all(
                    job.assignee.map(async (assignee) => {
                        const notification: CreateNotificationDto = {
                            userId: assignee.id,
                            title: renderTemplate(
                                NOTIFICATION_CONTENT_TEMPLATES.notifyAssigneeWhenPaid.title,
                                {
                                    jobNo: job.no,
                                }
                            ),
                            content: renderTemplate(
                                NOTIFICATION_CONTENT_TEMPLATES.notifyAssigneeWhenPaid.content,
                                {
                                    jobNo: job.no,
                                    paidBy: modifier?.displayName ?? "Accounting",
                                }
                            ),
                            type: NotificationType.JOB_UPDATE,
                            redirectUrl: renderTemplate(NOTIFICATION_CONTENT_TEMPLATES.notifyAssigneeWhenPaid.url, { jobNo: job.no }),
                            imageUrl: IMAGES.NOTIFICATION_DEFAULT_IMAGE,
                        }

                        return this.notificationService.send(notification)
                    })
                )
            }

            return { id: updateJob.id, no: updateJob.no }
        })
    }

    async changeStatus(
        jobId: string,
        modifierId: string,
        data: ChangeStatusDto
    ): Promise<{ id: string; no: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')

        return await this.prisma.$transaction(async (tx) => {
            // 1. Find job (Cần lấy field completedAt hiện tại để check)
            const job = await tx.job.findUnique({
                where: { id: jobId },
                include: {
                    status: true
                }
            })

            if (!job) throw new NotFoundException('Job not found')

            // 2. Get Target Status
            const targetStatus = await tx.jobStatus.findUnique({
                where: { code: data.newStatus },
            })
            if (!targetStatus)
                throw new NotFoundException('Target status not found')


            const getUpdateData = () => {
                let base = {
                    statusId: targetStatus.id
                }
                if (targetStatus.systemType === JobStatusSystemType.COMPLETED) {
                    return Object.assign(base, { completedAt: new Date() });
                }
                if (targetStatus.systemType === JobStatusSystemType.TERMINATED) {
                    if (job.status.systemType !== JobStatusSystemType.COMPLETED) {
                        return Object.assign(base, { completedAt: new Date(), finishedAt: new Date(), isPaid: true });
                    } else {
                        return Object.assign(base, { finishedAt: new Date(), isPaid: true });
                    }
                }
                return base
            }

            const updateData = getUpdateData()
            // 5. Update Job
            const updateJob = await tx.job.update({
                where: { id: jobId },
                data: updateData,
            })

            // 6. Create activity log
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

            // 7. Send notification to assignees
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
                                NOTIFICATION_CONTENT_TEMPLATES.notifyAssigneeWhenChangeStatus.content,
                                {
                                    jobNo: job.no,
                                    newStatus: targetStatus.displayName,
                                }
                            ),
                            type: NotificationType.JOB_UPDATE,
                            redirectUrl: renderTemplate(NOTIFICATION_CONTENT_TEMPLATES.notifyAssigneeWhenChangeStatus.url, { jobNo: job.no }),
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
            const results = await Promise.all(
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
        if (!jobId) {
            throw new BadRequestException('Job ID invalid')
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                // 1. Find job
                const job = await tx.job.findUnique({
                    where: { id: jobId },
                    select: {
                        statusId: true,
                        no: true
                    },
                })
                if (!job) throw new NotFoundException('Job not found')

                // 2. Update members
                const updatedJob = await tx.job.update({
                    where: { id: jobId },
                    include: {
                        status: true
                    },
                    data: {
                        ...(data.updateMemberIds &&
                            JSON.parse(data.updateMemberIds).length > 0 && {
                            assignee: {
                                connect: JSON.parse(
                                    data.updateMemberIds
                                ).map((id: string) => ({
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

                const updateMemberIdsArr: string[] = data.updateMemberIds ? JSON.parse(data.updateMemberIds) : []
                if (updateMemberIdsArr.length > 0) {
                    await Promise.all(
                        updateMemberIdsArr.map(async (assigneeId) => {
                            const notification: CreateNotificationDto = {
                                userId: assigneeId,
                                title: 'You have been assigned to job ' + job.no,
                                content: "Please review the job details and start working on it.",
                                type: NotificationType.JOB_UPDATE,
                                redirectUrl: renderTemplate(NOTIFICATION_CONTENT_TEMPLATES.jobDetailUrl, { jobNo: job.no }),
                                imageUrl: updatedJob.status.thumbnailUrl ?? IMAGES.NOTIFICATION_DEFAULT_IMAGE,
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

    async removeMember(
        jobId: string,
        modifierId: string,
        memberId: string
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
                    select: {
                        statusId: true,
                        assignee: { select: { id: true } },
                    },
                })
                if (!job) throw new NotFoundException('Job not found')

                // check if member exists in assignee list
                const prevMemberIds = job.assignee.map((m) => m.id)
                if (!prevMemberIds.includes(memberId)) {
                    throw new NotFoundException(
                        'Member not assigned to this job'
                    )
                }

                // 2. Update job - remove the member
                const updated = await tx.job.update({
                    where: { id: jobId },
                    data: {
                        assignee: {
                            disconnect: { id: memberId },
                        },
                    },
                })

                // 3. Create activity log
                const updatedMemberIds = prevMemberIds.filter(
                    (id) => id !== memberId
                )

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
