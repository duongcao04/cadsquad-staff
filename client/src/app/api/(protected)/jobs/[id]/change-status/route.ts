import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const jobId = parseInt(id)
    const { fromStatusId, toStatusId } = body

    if (isNaN(jobId)) {
        return NextResponse.json(
            { success: false, message: 'Job ID invalid' },
            { status: 400 }
        )
    }

    try {
        const modifiedBy = await prisma.user.findUnique({
            where: { uuid: user.sub },
        })
        const existingProject = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!existingProject) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy dự án' },
                { status: 404 }
            )
        }
        const result = await prisma.$transaction(async (tx) => {
            // Update the job status
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: {
                    statusId: Number(toStatusId),
                },
            })

            // Create the activity log
            await tx.jobActivityLog.create({
                data: {
                    activityType: 'ChangeStatus',
                    previousValue: fromStatusId,
                    currentValue: toStatusId,
                    fieldName: 'Status',
                    modifiedById: Number(modifiedBy?.id),
                    jobId,
                },
            })

            return updatedJob
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
