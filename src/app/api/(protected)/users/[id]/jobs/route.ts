import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTabQuery } from '../../../jobs/utils/getTabQuery'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const userId = parseInt(id)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const jobNo = searchParams.get('jobNo')
    const tabQuery = searchParams.get('tab')
    const tab = tabQuery ?? 'active'

    let getJobPermission = {}
    try {
        // Lấy thông tin User từ header auth
        // - Admin xem được toàn bộ dự án
        // - User chỉ xem được dự án của mình
        const getUser = await prisma.user.findUnique({
            where: { id: userId },
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
        if (getUser.role !== 'ADMIN') {
            getJobPermission = {
                memberAssign: {
                    some: {
                        id: userId,
                    },
                },
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: 'Xác thực không thành công',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    // 1. Get by Job No.
    if (jobNo) {
        try {
            const result = await prisma.job.findUnique({
                where: {
                    jobNo: jobNo,
                    deletedAt: null,
                    ...getJobPermission,
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
                            activityLog: true,
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
        const [jobs, total] = await Promise.all([
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
                            activityLog: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.job.count({
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
            }),
        ])

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
