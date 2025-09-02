import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const userHeader = request.headers.get('x-user')
    const user = userHeader ? JSON.parse(userHeader) : null
    // 1. Get user from headers
    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Xác thực thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    try {
        const userAccess = await prisma.user.findUnique({
            where: {
                uuid: user.sub,
            },
            select: {
                role: true,
            },
        })
        if (userAccess?.role !== 'ADMIN') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Bạn không có quyền truy cập',
                    error: 'Forbidden',
                },
                { status: 403 }
            )
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: 'Bạn không có quyền truy cập',
                error: 'Forbidden',
            },
            { status: 403 }
        )
    }

    try {
        const result = await prisma.user.findMany({
            where: {
                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            username: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            department: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                    ],
                }),
            },
            orderBy: {
                name: 'asc',
            },
            include: {
                assignedJobs: {},
                createdJobs: {},
                notifications: {},
                _count: {
                    select: {
                        assignedJobs: true,
                        createdJobs: true,
                        notifications: true,
                        files: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách thông tin người dùng thành công',
            result,
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy danh sách thông tin người dùng thất bại',
                error,
            },
            { status: 500 }
        )
    }
}
