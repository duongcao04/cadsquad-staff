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
} from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import lodash from 'lodash'
import slugify from 'slugify'
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { NOTIFICATION_CONTENT_TEMPLATES } from '../../utils'
import { APP_PERMISSIONS } from '../../utils/_app-permissions'
import { renderTemplate } from '../../utils/_string'
import { NotificationService } from '../notification/notification.service'
import { UserService } from '../user/user.service'
import { AssignMemberDto, UpdateAssignmentDto } from './dto/assign-member.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { DeliverJobDto } from './dto/deliver-job.dto'
import { JobFiltersBuilder } from './dto/job-filters.dto'
import { JobQueryBuilder, JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto } from './dto/job-response.dto'
import { JobSortBuilder } from './dto/job-sort.dto'
import { UpdateGeneralJobDto } from './dto/update-general.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { UpdateRevenueDto } from './dto/update-revenue.dto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class JobService {
    private readonly logger = new Logger(JobService.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    /**
     * PRIVATE HELPER: Handles data privacy.
     * Members see personal 'staffCost'. Admins see 'incomeCost' and 'totalStaffCost'.
     */
    private async mapRoleBasedData(
        rawData: Prisma.JobGetPayload<{
            include: {
                assignments: { include: { user: true } }
            }
        }>[],
        userId: string
    ) {
        const userPermissions =
            await this.authService.getEffectivePermissions(userId)

        const canReadSensitiveData = userPermissions.includes(
            APP_PERMISSIONS.JOB.READ_SENSITIVE
        )

        const mapData = rawData.map((job) => {
            const personalCost = job.assignments?.find(
                (a: any) => a.userId === userId || a.user?.id === userId
            )?.staffCost

            return {
                ...job,
                totalStaffCost: canReadSensitiveData
                    ? job.totalStaffCost
                    : undefined,
                staffCost: personalCost ?? undefined,
                assignments: job.assignments?.map((asm: any) => ({
                    ...asm,
                    staffCost: canReadSensitiveData ? asm.staffCost : undefined,
                    user: asm.user
                        ? {
                              id: asm.user.id,
                              displayName: asm.user.displayName,
                              username: asm.user.username,
                              avatar: asm.user.avatar,
                          }
                        : undefined,
                })),
            }
        })
        return mapData
    }

    // -------------------------------------------------------------------------
    // READ METHODS
    // -------------------------------------------------------------------------

    async findAll(
        userId: string,
        userPermissions: string[],
        query: JobQueryDto
    ): Promise<{ data: Job[]; paginate: PaginationMeta }> {
        const {
            tab,
            hideFinishItems,
            page = 1,
            limit = 10,
            search,
            sort = 'createdAt:desc',
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

        const userPermission = await this.buildPermission(userId)
        const queryBuilder: Prisma.JobWhereInput = {
            AND: [
                userPermission,
                hideFinishItems
                    ? { status: { isNot: { systemType: 'TERMINATED' } } }
                    : {},
                tabQuery,
                filtersQuery,
                searchQuery,
            ],
        }

        const [rawData, total] = await Promise.all([
            this.prisma.job.findMany({
                where: queryBuilder,
                orderBy,
                take: isAll ? undefined : Number(limit),
                skip: isAll ? undefined : (Number(page) - 1) * Number(limit),
                include: {
                    type: true,
                    status: true,
                    paymentChannel: true,
                    client: {
                        select: {
                            name: true,
                        },
                    },
                    assignments: { include: { user: true } },
                },
            }),
            this.prisma.job.count({ where: queryBuilder }),
        ])

        const mappedData = await this.mapRoleBasedData(rawData, userId)
        return {
            data: plainToInstance(JobResponseDto, mappedData, {
                excludeExtraneousValues: true,
                groups: userPermissions,
            }) as unknown as Job[],
            paginate: {
                limit: Number(limit),
                page: Number(page),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        }
    }

    async getWorkbenchData(
        userId: string,
        userPermissions: string[],
        query: JobQueryDto
    ) {
        const pinned = await this.prisma.pinnedJob.findMany({
            where: { userId },
            select: { jobId: true },
        })
        const pinnedIds = pinned.map((p) => p.jobId)

        const result = await this.findAll(userId, userPermissions, query)
        result.data = result.data.map((job) => ({
            ...job,
            isPinned: pinnedIds.includes(job.id),
        }))
        return result
    }

    async findByJobNo(
        userId: string,
        userPermissions: string[],
        jobNo: string
    ): Promise<Job> {
        const userPermission = await this.buildPermission(userId)

        const job = await this.prisma.job.findFirst({
            where: { AND: [userPermission, { no: jobNo }] },
            include: {
                type: true,
                assignments: { include: { user: true } },
                createdBy: true,
                paymentChannel: true,
                status: true,
                client: {
                    select: {
                        name: true,
                    },
                },
                comments: {
                    include: { user: true },
                    orderBy: { createdAt: 'desc' },
                },
                activityLog: {
                    include: { modifiedBy: true },
                    orderBy: { modifiedAt: 'desc' },
                },
            },
        })
        if (!job) throw new NotFoundException('Job not found')
        const mappedData = (await this.mapRoleBasedData([job], userId))[0]

        return plainToInstance(JobResponseDto, mappedData, {
            excludeExtraneousValues: true,
            groups: [
                userPermissions.find(
                    (item) => item === 'job.readSensitive'
                ) as string,
            ],
        }) as unknown as Job
    }
    async findJobsDueAt(
        userId: string,
        userPermissions: string[],
        isoDate: string
    ): Promise<Job[]> {
        const startOfDay = dayjs(isoDate).startOf('day').toDate()
        const endOfDay = dayjs(isoDate).endOf('day').toDate()
        const userPermission = await this.buildPermission(userId)

        const rawData = await this.prisma.job.findMany({
            where: {
                AND: [
                    { dueAt: { gte: startOfDay, lte: endOfDay } },
                    { deletedAt: null },
                    userPermission,
                ],
            },
            include: {
                status: true,
                type: true,
                assignments: { include: { user: true } },
            },
        })
        const mappedData = await this.mapRoleBasedData(rawData, userId)
        return plainToInstance(JobResponseDto, mappedData, {
            excludeExtraneousValues: true,
            groups: [
                userPermissions.find(
                    (item) => item === 'job.readSensitive'
                ) as string,
            ],
        }) as unknown as Job[]
    }

    async getDueInMonth(
        month: number,
        year: number,
        userId: string,
        userPermissions: string[]
    ): Promise<Job[]> {
        const startOfMonth = dayjs()
            .year(year)
            .month(month - 1)
            .startOf('month')
            .toDate()
        const endOfMonth = dayjs()
            .year(year)
            .month(month - 1)
            .endOf('month')
            .toDate()

        const userPermission = await this.buildPermission(userId)
        const rawData = await this.prisma.job.findMany({
            where: {
                AND: [
                    { dueAt: { gte: startOfMonth, lte: endOfMonth } },
                    { deletedAt: null },
                    userPermission,
                ],
            },
            include: {
                status: true,
                type: true,
                assignments: { include: { user: true } },
            },
            orderBy: { dueAt: 'asc' },
        })
        const mappedData = await this.mapRoleBasedData(rawData, userId)
        return plainToInstance(JobResponseDto, mappedData, {
            excludeExtraneousValues: true,
            groups: [
                userPermissions.find(
                    (item) => item === 'job.readSensitive'
                ) as string,
            ],
        }) as unknown as Job[]
    }

    async getPendingDeliverJobs(userId: string, userPermissions: string[]) {
        const userPermission = await this.buildPermission(userId)
        const rawData = await this.prisma.job.findMany({
            where: {
                AND: [
                    userPermission,
                    { status: { code: { in: ['in-progress', 'revision'] } } },
                    { deletedAt: null },
                ],
            },
            orderBy: { dueAt: 'asc' },
            include: {
                status: true,
                type: true,
                assignments: { include: { user: true } },
            },
        })
        const mappedData = await this.mapRoleBasedData(rawData, userId)
        return plainToInstance(JobResponseDto, mappedData, {
            excludeExtraneousValues: true,
            groups: [
                userPermissions.find(
                    (item) => item === 'job.readSensitive'
                ) as string,
            ],
        }) as unknown as Job[]
    }

    async getPendingPaymentJobs() {
        const result = await this.prisma.job.findMany({
            where: {
                status: { systemType: 'COMPLETED' },
                isPaid: false,
                deletedAt: null,
            },
            include: {
                status: true,
                type: true,
                paymentChannel: true,
                assignments: { include: { user: true } },
            },
            orderBy: { completedAt: 'asc' },
        })
        const mappedData = result.map((it) => ({
            ...it,
            totalStaffCost: it.totalStaffCost,
        }))
        return mappedData
    }

    /**
     * Admin reviews a staff delivery.
     * If approved: Job moves to 'completed'.
     * If rejected: Job moves to 'revision'.
     */
    async reviewDeliveryActions(
        adminId: string,
        deliveryId: string,
        isApproved: boolean,
        feedback?: string
    ) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Update the delivery status
            const delivery = await tx.jobDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: isApproved ? 'APPROVED' : 'REJECTED',
                    adminFeedback: feedback,
                },
                include: {
                    job: { include: { status: true } },
                    user: true, // The staff who delivered
                },
            })

            // 2. Determine the next job status based on approval
            const nextStatusCode = isApproved ? 'completed' : 'revision'
            const nextStatus = await tx.jobStatus.findUnique({
                where: { code: nextStatusCode },
            })

            if (!nextStatus) {
                throw new NotFoundException(
                    `Status code '${nextStatusCode}' not found in DB`
                )
            }

            // 3. Update the Job
            const jobUpdated = await tx.job.update({
                where: { id: delivery.jobId },
                data: {
                    statusId: nextStatus.id,
                    completedAt: isApproved ? new Date() : undefined,
                },
                select: { no: true, displayName: true },
            })

            // 4. Log the activity
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

            // 5. Send real-time notifications
            // Notification for the staff member
            await this.notificationService.send({
                userId: delivery.userId,
                senderId: adminId,
                title: isApproved
                    ? 'Delivery Approved! ✅'
                    : 'Revision Required ✍️',
                content: isApproved
                    ? `Your delivery for ${jobUpdated.displayName} was approved.`
                    : `Your delivery was rejected. Feedback: ${feedback}`,
                type: isApproved
                    ? NotificationType.SUCCESS
                    : NotificationType.WARNING,
                redirectUrl: `/jobs/${jobUpdated.no}`,
            })

            // If approved, notify Accounting to prepare payout
            if (isApproved) {
                const accountants = await tx.user.findMany({
                    where: {
                        role: {
                            permissions: {
                                some: {
                                    entityAction: APP_PERMISSIONS.JOB.PAID,
                                },
                            },
                        },
                    },
                })

                if (accountants.length > 0) {
                    await this.notificationService.sendMany(
                        accountants.map((acc) => ({
                            userId: acc.id,
                            title: 'New Payout Pending',
                            content: `Job #${jobUpdated.no} is completed and ready for payment.`,
                            type: NotificationType.JOB_UPDATE,
                            redirectUrl: `/financial/pending-payouts`,
                        }))
                    )
                }
            }

            return delivery
        })
    }

    /**
     * Manually changes a job status.
     * Handles logic for system types like COMPLETED and TERMINATED.
     */
    async changeStatus(
        jobId: string,
        modifierId: string,
        data: ChangeStatusDto
    ): Promise<{ id: string; no: string }> {
        if (!jobId) throw new BadRequestException('Job ID invalid')

        return await this.prisma.$transaction(async (tx) => {
            // 1. Fetch current job and the target status
            const job = await tx.job.findUnique({
                where: { id: jobId },
                include: { status: true, assignments: true },
            })
            if (!job) throw new NotFoundException('Job not found')

            const targetStatus = await tx.jobStatus.findUnique({
                where: { code: data.newStatus },
            })
            if (!targetStatus)
                throw new NotFoundException('Target status not found')

            // 2. Prepare logic based on System Type
            const now = new Date()
            const updateData: Prisma.JobUpdateInput = {
                status: { connect: { id: targetStatus.id } },
            }

            // If moving to a COMPLETED system type (e.g., "Done", "Review Passed")
            if (targetStatus.systemType === JobStatusSystemType.COMPLETED) {
                updateData.completedAt = now
            }

            // If moving to a TERMINATED system type (e.g., "Finished", "Cancelled")
            if (targetStatus.systemType === JobStatusSystemType.TERMINATED) {
                updateData.finishedAt = now
                // Auto-mark as paid if it's being terminated (optional logic)
                updateData.isPaid = true
                if (!job.paidAt) updateData.paidAt = now
            }

            // 3. Update the Job record
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: updateData,
            })

            // 4. Log the activity history
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    modifiedById: modifierId,
                    fieldName: 'status',
                    activityType: ActivityType.ChangeStatus,
                    previousValue: job.status.code,
                    currentValue: data.newStatus,
                },
            })

            // 5. Notify all assigned staff about the status change
            if (job.assignments && job.assignments.length > 0) {
                const notifications = job.assignments.map((assignee) => ({
                    userId: assignee.userId,
                    senderId: modifierId,
                    title: 'Trạng thái công việc thay đổi 🔄',
                    content: renderTemplate(
                        NOTIFICATION_CONTENT_TEMPLATES
                            .notifyAssigneeWhenChangeStatus.content,
                        {
                            jobNo: job.no,
                            newStatus: targetStatus.displayName,
                        }
                    ),
                    type: NotificationType.STATUS_CHANGE,
                    redirectUrl: `/jobs/${job.no}`,
                }))

                await this.notificationService.sendMany(notifications)
            }

            return { id: jobId, no: updatedJob.no }
        })
    }

    // -------------------------------------------------------------------------
    // WRITE / ACTION METHODS
    // -------------------------------------------------------------------------

    async create(createdById: string, data: CreateJobDto): Promise<Job> {
        return await this.prisma.$transaction(async (tx) => {
            const defaultStatus = await tx.jobStatus.findUnique({
                where: { order: 1 },
            })
            if (!defaultStatus)
                throw new InternalServerErrorException(
                    'Initial status order 1 not found'
                )

            const {
                jobAssignments,
                clientName,
                typeId,
                paymentChannelId,
                incomeCost,
                totalStaffCost,
                attachmentUrls,
                ...jobData
            } = data

            const job = await tx.job.create({
                data: {
                    ...jobData,
                    status: { connect: { id: defaultStatus.id } },
                    createdBy: { connect: { id: createdById } },
                    type: { connect: { id: typeId } },
                    paymentChannel: paymentChannelId
                        ? { connect: { id: paymentChannelId } }
                        : undefined,
                    incomeCost: parseFloat(incomeCost) || 0,
                    totalStaffCost: parseFloat(totalStaffCost) || 0,
                    client: {
                        connectOrCreate: {
                            where: { name: clientName },
                            create: {
                                name: clientName,
                                code: slugify(clientName, { lower: true }),
                            },
                        },
                    },
                    attachmentUrls: Array.isArray(attachmentUrls)
                        ? attachmentUrls
                        : [],
                    assignments: {
                        create:
                            jobAssignments?.map((asgn) => ({
                                user: { connect: { id: asgn.userId } },
                                staffCost: parseFloat(asgn.staffCost) || 0,
                            })) || [],
                    },
                },
                include: {
                    status: true,
                    assignments: { include: { user: true } },
                },
            })

            await tx.jobActivityLog.create({
                data: {
                    jobId: job.id,
                    modifiedById: createdById,
                    fieldName: 'Job Created',
                    activityType: ActivityType.CreateJob,
                    currentValue: job.no,
                },
            })
            return plainToInstance(JobResponseDto, job, {
                excludeExtraneousValues: true,
            }) as unknown as Job
        })
    }

    async updateGeneralInfo(
        modifierId: string,
        jobId: string,
        dto: UpdateGeneralJobDto
    ) {
        return await this.prisma.$transaction(async (tx) => {
            let clientId: string | undefined = undefined

            // 1. Handle Client Logic: Find or Create
            if (dto.clientName) {
                // 1. Tìm kiếm Client tồn tại (không phân biệt hoa thường)
                const existingClient = await tx.client.findFirst({
                    where: {
                        name: {
                            equals: dto.clientName.trim(),
                            mode: 'insensitive', // Quan trọng: PostgreSQL sẽ coi "Apple", "apple", "APPLE" là một
                        },
                    },
                })

                if (existingClient) {
                    clientId = existingClient.id
                } else {
                    // 2. Nếu chưa có thì mới tạo mới
                    const newClient = await tx.client.create({
                        data: {
                            name: dto.clientName.trim(), // Xóa khoảng trắng thừa
                            code: `CSD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                        },
                    })
                    clientId = newClient.id
                }
            }

            // 2. Perform the Job update
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: {
                    displayName: dto.displayName,
                    clientId: clientId, // Link the found/created client ID
                    startedAt: dto.startedAt,
                    dueAt: dto.dueAt,
                    description: dto.description,
                },
                include: { client: true },
            })

            // 3. Activity Logging
            await tx.jobActivityLog.create({
                data: {
                    jobId: jobId,
                    modifiedById: modifierId,
                    fieldName: 'General Information',
                    activityType: ActivityType.UpdateInformation,
                    notes: `Updated project info. Client set to: ${dto.clientName}`,
                },
            })

            return { id: updatedJob.id, no: updatedJob.no }
        })
    }
    async update(modifierId: string, jobId: string, data: UpdateJobDto) {
        return await this.prisma.$transaction(async (tx) => {
            const current = await tx.job.findUnique({ where: { id: jobId } })
            if (!current) throw new NotFoundException('Job not found')

            const updated = await tx.job.update({
                where: { id: jobId },
                data: {
                    ...lodash.omit(data, ['incomeCost', 'attachmentUrls']),
                    incomeCost: data.incomeCost
                        ? Number(data.incomeCost)
                        : undefined,
                    attachmentUrls: data.attachmentUrls
                        ? Array.isArray(data.attachmentUrls)
                            ? data.attachmentUrls
                            : [data.attachmentUrls]
                        : undefined,
                },
            })

            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Information',
                    activityType: ActivityType.UpdateInformation,
                    currentValue: JSON.stringify(data),
                },
            })
            return { id: updated.id, no: updated.no }
        })
    }

    async assignMember(
        modifierId: string,
        jobId: string,
        dto: AssignMemberDto
    ) {
        const { memberId, staffCost } = dto
        return await this.prisma.$transaction(async (tx) => {
            const job = await tx.job.findUnique({
                where: { id: jobId },
                select: { id: true, no: true, displayName: true },
            })
            if (!job) throw new NotFoundException('Job not found')

            try {
                await tx.jobAssignment.create({
                    data: { jobId, userId: memberId, staffCost },
                })
            } catch (e) {
                throw new BadRequestException(
                    'User is already assigned to this job'
                )
            }

            const aggregate = await tx.jobAssignment.aggregate({
                where: { jobId },
                _sum: { staffCost: true },
            })

            await tx.job.update({
                where: { id: jobId },
                data: { totalStaffCost: aggregate._sum.staffCost || 0 },
            })

            // --- FIX NOTIFICATION ---
            await this.notificationService.send({
                userId: memberId,
                senderId: modifierId,
                title: 'Bạn có công việc mới 📋',
                content: `Bạn vừa được giao vào dự án: ${job.no} - ${job.displayName}`,
                type: NotificationType.JOB_UPDATE,
                redirectUrl: `/jobs/${job.no}`,
            })

            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Member Assignment',
                    currentValue: memberId,
                    activityType: ActivityType.Private,
                    notes: `Assigned with staff cost: ${staffCost}`,
                },
            })

            return job
        })
    }

    async updateAssignmentCost(
        modifierId: string,
        jobId: string,
        memberId: string,
        dto: UpdateAssignmentDto
    ) {
        const { staffCost } = dto

        return await this.prisma.$transaction(async (tx) => {
            // 1. Update the specific assignment
            const updatedAssignment = await tx.jobAssignment.update({
                where: {
                    jobId_userId: {
                        userId: memberId,
                        jobId: jobId,
                    },
                },
                data: { staffCost },
                include: { user: { select: { displayName: true } } },
            })
            // 2. Recalculate the total sum for the Job
            const aggregate = await tx.jobAssignment.aggregate({
                where: { jobId: updatedAssignment.jobId },
                _sum: { staffCost: true },
            })

            await tx.job.update({
                where: { id: updatedAssignment.jobId },
                data: { totalStaffCost: aggregate._sum.staffCost || 0 },
            })

            // 3. Log the financial change
            await tx.jobActivityLog.create({
                data: {
                    jobId: updatedAssignment.jobId,
                    modifiedById: modifierId,
                    fieldName: 'Staff Cost Update',
                    currentValue: staffCost.toString(),
                    activityType: ActivityType.Private,
                    notes: `Updated cost for ${updatedAssignment.user.displayName} to ${staffCost}`,
                },
            })

            return updatedAssignment
        })
    }

    async removeMember(modifierId: string, jobId: string, userId: string) {
        return await this.prisma.$transaction(async (tx) => {
            // 1. Check if assignment exists and get user info for the log
            const assignment = await tx.jobAssignment.findUnique({
                where: {
                    jobId_userId: { jobId, userId },
                },
                include: { user: { select: { displayName: true } } },
            })

            if (!assignment) throw new NotFoundException('Assignment not found')

            // 2. Delete the assignment
            await tx.jobAssignment.delete({
                where: {
                    jobId_userId: { jobId, userId },
                },
            })

            // 3. Recalculate the total sum for the Job
            const aggregate = await tx.jobAssignment.aggregate({
                where: { jobId },
                _sum: { staffCost: true },
            })

            await tx.job.update({
                where: { id: jobId },
                data: {
                    totalStaffCost: aggregate._sum.staffCost || 0,
                },
            })

            // 4. Log the removal
            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Member Assignment',
                    previousValue: userId,
                    currentValue: null,
                    activityType: ActivityType.Private,
                    notes: `Removed ${assignment.user.displayName} from the project`,
                },
            })

            return { success: true, removedUserId: userId }
        })
    }

    async deliverJob(userId: string, jobId: string, dto: DeliverJobDto) {
        return this.prisma.$transaction(async (tx) => {
            const reviewStatus = await tx.jobStatus.findFirst({
                where: { systemType: 'WAIT_REVIEW' },
            })
            if (!reviewStatus)
                throw new BadRequestException('WAIT_REVIEW status missing')

            const delivery = await tx.jobDelivery.create({
                data: { jobId, userId, ...dto, status: 'PENDING' },
            })
            const job = await tx.job.update({
                where: { id: jobId },
                data: { statusId: reviewStatus.id },
                include: { createdBy: { select: { displayName: true } } }, // Lấy tên người gửi
            })

            // --- FIX NOTIFICATION ---
            const approver = await tx.user.findMany({
                where: {
                    role: {
                        permissions: {
                            some: {
                                entityAction: APP_PERMISSIONS.JOB.REVIEW,
                            },
                        },
                    },
                },
            })
            await this.notificationService.sendMany(
                approver.map((admin) => ({
                    userId: admin.id,
                    senderId: userId,
                    title: 'Bản bàn giao mới cần duyệt 🚀',
                    content: `Công việc #${job.no} vừa được nhân viên gửi bản bàn giao.`,
                    type: NotificationType.JOB_UPDATE,
                    redirectUrl: `/admin/mgmt/jobs/${job.no}?tab=deliveries`,
                }))
            )

            return delivery
        })
    }

    async getJobDeliveries(jobId: string) {
        // Check if job exists first
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!job) throw new NotFoundException('Job not found')

        return this.prisma.jobDelivery.findMany({
            where: { jobId },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' }, // Latest delivery first
        })
    }

    async updateRevenue(
        modifierId: string,
        jobId: string,
        dto: UpdateRevenueDto
    ) {
        const updateData: Prisma.JobUpdateInput = {}
        if (
            lodash.isEmpty(dto) ||
            (lodash.isEmpty(dto.incomeCost) &&
                lodash.isEmpty(dto.paymentChannelId))
        ) {
            throw new BadRequestException()
        } else {
            if (!lodash.isEmpty(dto.paymentChannelId)) {
                updateData['paymentChannelId'] = dto.paymentChannelId
            }
            if (!lodash.isEmpty(dto.incomeCost)) {
                updateData['incomeCost'] = parseFloat(dto.incomeCost)
            }
        }

        return await this.prisma.$transaction(async (tx) => {
            const job = await tx.job.findUnique({
                where: { id: jobId },
            })
            if (!job) throw new BadRequestException('Job not found')

            const updated = await tx.job.update({
                where: { id: jobId },
                data: updateData,
            })
            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Financial',
                    activityType: ActivityType.UpdateInformation,
                    currentValue: 'Paid',
                },
            })
            return { id: updated.id, no: updated.no }
        })
    }

    async markPaid(jobId: string, modifierId: string) {
        return await this.prisma.$transaction(async (tx) => {
            const job = await tx.job.findUnique({
                where: { id: jobId },
                include: { status: true, assignments: true },
            })
            if (!job || job.isPaid)
                throw new BadRequestException('Job already paid or not found')

            const finishStatus = await tx.jobStatus.findFirst({
                where: { systemType: 'TERMINATED' },
            })
            const now = new Date()
            const updateData: Prisma.JobUpdateInput = {
                isPaid: true,
                paidAt: now,
            }

            if (job.status.systemType === 'COMPLETED') {
                updateData.status = { connect: { id: finishStatus?.id } }
                updateData.finishedAt = now
            }

            const updated = await tx.job.update({
                where: { id: jobId },
                data: updateData,
            })
            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Payment',
                    activityType: ActivityType.MarkPaid,
                    currentValue: 'Paid',
                },
            })

            await this.notificationService.sendMany(
                job.assignments.map((a) => ({
                    userId: a.userId,
                    title: 'Payment Confirmed',
                    content: `Job #${job.no} paid.`,
                    type: NotificationType.JOB_UPDATE,
                    redirectUrl: `/jobs/${job.no}`,
                }))
            )
            return { id: updated.id, no: updated.no }
        })
    }

    // -------------------------------------------------------------------------
    // UTILS
    // -------------------------------------------------------------------------

    async togglePin(userId: string, jobId: string) {
        const existing = await this.prisma.pinnedJob.findUnique({
            where: { userId_jobId: { userId, jobId } },
        })
        if (existing) {
            await this.prisma.pinnedJob.delete({
                where: { userId_jobId: { userId, jobId } },
            })
            return { isPinned: false }
        }
        await this.prisma.pinnedJob.create({ data: { userId, jobId } })
        return { isPinned: true }
    }

    async delete(jobId: string, modifierId: string) {
        const updated = this.prisma.$transaction(async (tx) => {
            await tx.job.update({
                where: { id: jobId },
                data: { deletedAt: new Date() },
            })
            await tx.jobActivityLog.create({
                data: {
                    jobId,
                    modifiedById: modifierId,
                    fieldName: 'Deleted',
                    activityType: ActivityType.DeleteJob,
                },
            })
        })
        return { id: jobId }
    }

    private async buildPermission(
        userId: string
    ): Promise<Prisma.JobWhereInput> {
        const userPermissions = await this.userService.userPermissions(userId)
        const canReadAll = userPermissions.includes(
            APP_PERMISSIONS.JOB.READ_ALL
        )

        if (canReadAll) return {}
        return { assignments: { some: { userId } } }
    }
}
