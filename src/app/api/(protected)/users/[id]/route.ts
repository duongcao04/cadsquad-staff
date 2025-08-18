import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id)

    if (!id) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin người dùng thất bại',
                error: 'NOT FOUND',
            },
            { status: 404 }
        )
    }

    try {
        const result = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                assignedJobs: {},
                createdJobs: {},
                statusChanges: {},
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

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Lấy thông tin người dùng thất bại',
                    error: 'NOT FOUND',
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Lấy thông tin người dùng thành công',
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await request.json()
    const id = parseInt(params.id)
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        })
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    messgae: 'Không tìm thấy người dùng',
                },
                { status: 404 }
            )
        }

        const result = await prisma.user.update({
            where: { id },
            data: {
                ...body,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Câp nhật thông tin người dùng thành công',
                result,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            {
                success: false,
                messgae: 'Đăng người người dùng thất bại',
                error,
            },
            { status: 409 }
        )
    }
}
