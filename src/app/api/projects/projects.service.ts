import dayjs from 'dayjs'

import { JobStatus } from '@/generated/prisma'
import { PrismaClientType, ensureConnection } from '@/lib/prisma'
import { NewProject } from '@/validationSchemas/project.schema'

export type WorkflowStatus =
    | 'priority'
    | 'active'
    | 'late'
    | 'delivered'
    | 'completed'
    | 'cancelled'

export class ProjectService {
    private prisma!: PrismaClientType
    constructor() {
        this.init()
    }

    private async init() {
        this.prisma = await ensureConnection()
    }

    async getByJobNo(jobNo: string) {
        try {
            const project = await this.prisma.project.findUnique({
                where: {
                    jobNo: jobNo,
                },
                include: {
                    paymentChannel: {},
                    memberAssign: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            jobTitle: true,
                            department: true,
                            avatar: true,
                        },
                    },
                    jobStatus: {},
                    statusChanges: {},
                },
            })
            return project
        } catch (error) {
            return {
                error,
            }
        }
    }

    async getAll({
        search,
        page,
        limit,
    }: {
        search: string | null
        page: number
        limit: number
    }) {
        try {
            const where = {
                deletedAt: null,
                ...(search && {
                    OR: [
                        {
                            jobName: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            jobNo: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                    ],
                }),
            }

            const [projects, total] = await Promise.all([
                this.prisma.project.findMany({
                    where,
                    include: {
                        paymentChannel: {},
                        memberAssign: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                jobTitle: true,
                                department: true,
                                avatar: true,
                            },
                        },
                        jobStatus: {},
                        statusChanges: {},
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                this.prisma.project.count({ where }),
            ])

            return {
                records: projects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async getByWorkflowStatus(workflowStatusName: WorkflowStatus) {
        try {
            const today = dayjs().startOf('day').toDate()
            const dayAfterTomorrow = dayjs()
                .add(2, 'day')
                .startOf('day')
                .toDate()

            let where: Record<string, unknown> = {
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
                jobStatus: {
                    is: {
                        title: 'Completed',
                    },
                },
            }
            const deliveredFilter = {
                ...where,
                jobStatus: {
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
                        jobStatus: {
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

            switch (workflowStatusName) {
                case 'priority':
                    where = priorityFilter
                    break
                case 'active':
                    where = activeFilter
                    break
                case 'completed':
                    where = completedFilter
                    break
                case 'delivered':
                    where = deliveredFilter
                    break
                case 'late':
                    where = lateFilter
                    break
                case 'cancelled':
                    where = cancelledFilter
                    break
                default:
                    break
            }

            // Get counts for all workflow statuses
            const counts = await Promise.all([
                this.prisma.project.count({ where: priorityFilter }),
                this.prisma.project.count({ where: activeFilter }),
                this.prisma.project.count({ where: completedFilter }),
                this.prisma.project.count({ where: deliveredFilter }),
                this.prisma.project.count({ where: lateFilter }),
                this.prisma.project.count({ where: cancelledFilter }),
            ])

            const countsByStatus = {
                priority: counts[0],
                active: counts[1],
                completed: counts[2],
                delivered: counts[3],
                late: counts[4],
                cancelled: counts[5],
            }

            const records = await this.prisma.project.findMany({
                where,
                include: {
                    paymentChannel: {},
                    statusChanges: {},
                    memberAssign: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            jobTitle: true,
                            department: true,
                            avatar: true,
                        },
                    },
                    jobStatus: {},
                },
                orderBy: { createdAt: 'desc' },
            })
            return { records, count: countsByStatus }
        } catch (error) {
            console.error('Error fetching projects:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async create(projectData: NewProject) {
        try {
            return await this.prisma.project.create({
                data: {
                    jobNo: projectData.jobNo,
                    clientName: projectData.clientName,
                    jobName: projectData.jobName,
                    staffCost: Number(projectData.staffCost),
                    income: Number(projectData.income),
                    sourceUrl: projectData.sourceUrl,
                    startedAt: projectData.startedAt
                        ? new Date(projectData.startedAt)
                        : new Date(),
                    dueAt: new Date(projectData.dueAt),
                    completedAt: projectData.completedAt
                        ? new Date(projectData.completedAt)
                        : null,
                    jobStatus: {
                        connect: {
                            id: Number(projectData.jobStatusId),
                        },
                    },
                    jobType: {
                        connect: {
                            id: Number(projectData.jobTypeId),
                        },
                    },
                    paymentChannel: {
                        connect: {
                            id: Number(projectData.paymentChannelId),
                        },
                    },
                    createdBy: {
                        connect: {
                            id: projectData.createdById,
                        },
                    },
                    // Conditionally add memberAssign only if memberAssignIds exists and has items
                    ...(projectData.memberAssignIds &&
                        projectData.memberAssignIds.length > 0 && {
                            memberAssign: {
                                connect: projectData.memberAssignIds.map(
                                    (id: string) => ({
                                        id,
                                    })
                                ),
                            },
                        }),
                },
                include: {
                    memberAssign: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            jobTitle: true,
                            department: true,
                            avatar: true,
                        },
                    },
                },
            })
        } catch (error) {
            console.error('Error creating project:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async isExist({
        projectId,
        jobNo,
    }: {
        jobNo?: string
        projectId?: number
    }) {
        try {
            if (jobNo) {
                return await this.prisma.project.findUnique({
                    where: { jobNo: jobNo },
                    include: {
                        jobStatus: true,
                        memberAssign: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                })
            } else {
                return await this.prisma.project.findUnique({
                    where: { id: projectId },
                    include: {
                        jobStatus: true,
                        memberAssign: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                })
            }
        } catch (error) {
            console.error('Error creating project:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }

    async updateStatus({
        projectId,
        jobStatusId,
        newJobStatus,
    }: {
        projectId: number
        jobStatusId: number
        newJobStatus: JobStatus
    }) {
        try {
            return await this.prisma.project.update({
                where: { id: projectId },
                data: {
                    jobStatusId: jobStatusId,
                    // If switching to a completed status, you might want to set completedAt
                    ...(newJobStatus.title
                        .toLowerCase()
                        .includes('completed') && {
                        completedAt: new Date(),
                    }),
                },
                include: {
                    jobStatus: true,
                    memberAssign: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            username: true,
                        },
                    },
                },
            })
        } catch (error) {
            return { error: error, status: 500 }
        }
    }

    async delete(projectId: number) {
        try {
            return await this.prisma.project.update({
                where: { id: projectId },
                data: { deletedAt: new Date() }, // soft delete
            })
        } catch (error) {
            return { error: error, status: 500 }
        }
    }
}
