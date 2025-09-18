import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTabQuery } from '../utils/getTabQuery'

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
    const tabQuery = searchParams.get('tab')
    const tab = tabQuery ?? 'active'

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
        const result = await prisma.job.count({
            where: { ...getJobPermission, ...getTabQuery(tab) },
        })

        return NextResponse.json({
            success: true,
            message: `Lấy số lượng dự án theo tab ${tab.toUpperCase()} thành công`,
            result,
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Lấy số lượng dự án theo tab ${tab.toUpperCase()} thất bại`,
                error,
            },
            {
                status: 500,
            }
        )
    }
}
