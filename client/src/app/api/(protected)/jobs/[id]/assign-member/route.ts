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
    const { prevMemberIds, updateMemberIds } = body

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
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                memberAssign: {},
            },
        })

        if (!existingJob) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy dự án' },
                { status: 404 }
            )
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedJob = await prisma.job.update({
                where: { id: jobId },
                data: {
                    ...(JSON.parse(updateMemberIds).length > 0 && {
                        memberAssign: {
                            connect: JSON.parse(updateMemberIds).map(
                                (id: string) => ({
                                    id,
                                })
                            ),
                        },
                    }),
                },
                include: {
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
                },
            })

            // Create the activity log
            await tx.jobActivityLog.create({
                data: {
                    activityType: 'AssignMember',
                    previousValue: prevMemberIds,
                    currentValue: updateMemberIds,
                    fieldName: 'Assignee',
                    modifiedById: Number(modifiedBy?.id),
                    jobId,
                },
            })

            return updatedJob
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Phân công thành viên thành công',
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
                message: 'Phân công thành viên thất bại',
                error: error,
            },
            { status: 500 }
        )
    }
}
