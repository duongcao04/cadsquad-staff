import { NextRequest, NextResponse } from 'next/server'
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

        return NextResponse.json({
            success: true,
            message: "Lấy danh sách thông tin người dùng thành công",
            result,
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Lấy danh sách thông tin người dùng thất bại",
                error,
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // 1. Check user existing
        const existingEmail = await prisma.user.findUnique({
            where: { email: body.email },
        })
        if (existingEmail) {
            return NextResponse.json(
                {
                    success: false,
                    messgae: "Người dùng đã tồn tại",
                },
                { status: 409 }
            )
        }

        const userCreated = await prisma.user.create({
            data: {
                id: body.id,
                email: body.email,
                username: body.username,
                name: body.name,
                avatar: body.avatar,
                jobTitle: body.jobTitle,
                department: body.department,
                role: body.role || 'USER',
            },
            include: {
                assignedJobs: {
                    select: {
                        id: true,
                        jobNo: true,
                        jobName: true,
                        staffCost: true,
                    },
                },
            },
        })

        const result = {
            id: userCreated.id
        }
        return NextResponse.json(
            {
                success: true,
                message: "Đăng người người dùng thành công",
                result,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            {
                success: false,
                messgae: "Đăng người người dùng thất bại",
                error
            },
            { status: 409 }
        )
    }
}
