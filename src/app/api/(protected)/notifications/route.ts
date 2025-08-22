'use server'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const userHeader = request.headers.get('x-user')
    const user = userHeader ? JSON.parse(userHeader) : null
    // 1. Get user from headers
    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Quyền truy cập không hợp lệ',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    try {
        const userPrisma = await prisma.user.findUnique({
            where: {
                uuid: user.sub,
            },
        })
        // Get notifications sent to the current user
        const result = await prisma.userNotification.findMany({
            where: { userId: userPrisma?.id },
            include: {
                notification: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                notification: {
                    createdAt: 'desc',
                },
            },
        })
        console.log(result)

        return NextResponse.json(
            {
                success: true,
                message: 'Lấy danh sách thông báo thành công',
                result,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy danh sách thông báo Thất bại',
                error: 'NOT FOUND',
            },
            { status: 404 }
        )
    }
}
