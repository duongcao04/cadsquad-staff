import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const body = await request.json()
    const { id } = await params
    const jobId = parseInt(id)

    if (isNaN(jobId)) {
        return NextResponse.json(
            { success: false, message: 'Invalid project ID' },
            { status: 400 }
        )
    }

    try {
        const existingProject = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!existingProject) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy dự án' },
                { status: 404 }
            )
        }

        const result = await prisma.job.update({
            where: { id: jobId },
            data: { ...body },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Cập nhật dự án thành công',
                result,
            },
            {
                status: 200,
            }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: 'Cập nhật dự án thất bại',
                error: error,
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const jobId = Number(params.id)

    if (isNaN(jobId)) {
        return NextResponse.json(
            { message: 'JobID không hợp lệ' },
            { status: 400 }
        )
    }

    try {
        await prisma.job.update({
            where: { id: jobId },
            data: {
                deletedAt: new Date(),
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Xóa dự án thành công',
                result: {
                    jobId,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: true,
                message: 'Xóa dự án thất bại',
                error,
            },
            { status: 500 }
        )
    }
}
