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
                message: 'Lấy thông tin tài khoản thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }

    try {
        // 2. Match user on Supabase Auth and Prisma Database with UUID field
        const result = await prisma.user.findUnique({
            where: { uuid: user.sub },
        })
        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Lấy thông tin tài khoản thất bại',
                    error: 'NOT FOUND',
                },
                { status: 404 }
            )
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Lấy thông tin tài khoản thành công',
                result,
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Get user failed:::', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin tài khoản thất bại',
                error: 'Unauthenticated',
            },
            { status: 401 }
        )
    }
}
