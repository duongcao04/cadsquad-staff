import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const result = await prisma.user.findMany({
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
