import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTabQuery, TJobTab } from './utils/getTabQuery'

export async function GET(request: NextRequest) {
    const userHeader = request.headers.get('x-user')
    const user = userHeader ? JSON.parse(userHeader) : null
    // 1. Get user from headers
    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin tài khoản thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const jobNo = searchParams.get('jobNo')
    const tabQuery = searchParams.get('tab')
    const tab = tabQuery ?? 'active'

    // 1. Get by Job No.
    if (jobNo) {
        try {
            const getUser = await prisma.user.findUnique({
                where: { uuid: user.sub },
            })
            if (!getUser) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Xác thực không thành công',
                        error: 'Unauthenticated',
                    },
                    { status: 401 }
                )
            }
            console.log(getUser)

            const result = await prisma.job.findUnique({
                where: {
                    jobNo: jobNo,
                    deletedAt: null,
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
                    status: {},
                    activityLog: {},
                    createdBy: {},
                    jobType: {},
                    files: {},
                    _count: {
                        select: {
                            memberAssign: true,
                            files: true,
                        },
                    },
                },
            })
            if (!result) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Lấy thông tin dự án ${jobNo} thất bại`,
                        error: 'Not Found',
                    },
                    {
                        status: 404,
                    }
                )
            }

            return NextResponse.json({
                success: true,
                message: `Lấy thông tin dự án ${jobNo} thành công`,
                result,
            })
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Lấy thông tin dự án ${jobNo} thất bại`,
                    error,
                },
                {
                    status: 500,
                }
            )
        }
    }

    /**
     * 2. Get by Tab
     * - @priorityFilter Dự án gần hét hạn. < 1 ngày
     *! - @activeFilter Toàn bộ dự án được giao *DEFAULT TAB*
     * - @completedFilter Dự án đã hoàn thành
     * - @deliveredFilter Dự án đã giao
     * - @lateFilter Dự án trễ hạn
     * - @cancelledFilter Dự án đã hủy (delete)
     */
    try {
        // Lấy thông tin User từ header auth
        // - Admin xem được toàn bộ dự án
        // - User chỉ xem được dự án của mình
        const getUser = await prisma.user.findUnique({
            where: { uuid: user.sub },
        })
        if (!getUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Xác thực không thành công',
                    error: 'Unauthenticated',
                },
                { status: 401 }
            )
        }
        const getJobPermission =
            getUser.role === 'ADMIN'
                ? {}
                : {
                      memberAssign: {
                          some: {
                              uuid: user.sub,
                          },
                      },
                  }
        const [jobs, priority, active, completed, delivered, late, cancelled] =
            await Promise.all([
                prisma.job.findMany({
                    where: {
                        ...getJobPermission,
                        ...getTabQuery(tab),
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
                        status: {},
                        createdBy: {},
                        jobType: {},
                        activityLog: {},
                        files: {},
                        _count: {
                            select: {
                                memberAssign: true,
                                files: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('priority') },
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('active') },
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('completed') },
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('cancelled') },
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('late') },
                }),
                prisma.job.count({
                    where: { ...getJobPermission, ...getTabQuery('cancelled') },
                }),
            ])
        const counts = {
            priority,
            active,
            completed,
            delivered,
            late,
            cancelled,
        }

        const total = counts[tab as TJobTab]
        const meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }

        if (!jobs) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Lấy thông tin dự án theo tab ${tab} thất bại`,
                    error: 'Not Found',
                },
                {
                    status: 404,
                }
            )
        }

        //? tab active === toàn bộ dự án
        const responseMessage = tabQuery
            ? `Lấy thông tin dự án theo tab ${tabQuery.toUpperCase()} thành công`
            : 'Lấy danh sách thông tin dự án thành công'
        return NextResponse.json({
            success: true,
            message: responseMessage,
            result: {
                jobs,
                counts,
            },
            meta,
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Lấy thông tin dự án theo tab ${tab.toUpperCase()} thất bại`,
                error,
            },
            {
                status: 500,
            }
        )
    }
}

export async function POST(request: NextRequest) {
    const userHeader = request.headers.get('x-user')
    const user = userHeader ? JSON.parse(userHeader) : null
    // 1. Get user from headers
    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin tài khoản thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    const body = await request.json()
    const jobData = { ...body }

    try {
        const createdBy = await prisma.user.findUnique({
            where: { uuid: user.sub },
        })
        const status = await prisma.jobStatus.findUnique({
            where: {
                order: 1,
            },
        })
        const jobCreated = await prisma.job.create({
            data: {
                jobNo: jobData.jobNo,
                jobName: jobData.jobName,
                clientName: jobData.clientName,
                income: Number(jobData.income),
                staffCost: Number(jobData.staffCost),
                sourceUrl: jobData.sourceUrl,
                startedAt: jobData.startedAt
                    ? new Date(jobData.startedAt)
                    : new Date(),
                dueAt: new Date(jobData.dueAt),
                completedAt: jobData.completedAt
                    ? new Date(jobData.completedAt)
                    : null,
                status: {
                    connect: {
                        id: Number(status?.id),
                    },
                },
                jobType: {
                    connect: {
                        id: Number(jobData.jobTypeId),
                    },
                },
                paymentChannel: {
                    connect: {
                        id: Number(jobData.paymentChannelId),
                    },
                },
                createdBy: {
                    connect: {
                        id: createdBy?.id,
                    },
                },
                // Conditionally add memberAssign only if memberAssignIds exists and has items
                ...(jobData.memberAssignIds &&
                    jobData.memberAssignIds.length > 0 && {
                        memberAssign: {
                            connect: jobData.memberAssignIds.map(
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
        return NextResponse.json(
            {
                success: true,
                message: 'Tạo mới dự án thành công',
                result: jobCreated,
            },
            { status: 201 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: 'Tạo mới dự án thất bại',
                error: 'Server error',
            },
            { status: 500 }
        )
    }
}
