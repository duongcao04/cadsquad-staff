import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const jobId = parseInt(id)

    try {
        const result = await prisma.jobActivityLog.findMany({
            where: {
                jobId: Number(jobId),
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Lấy thông tin nhật ký hoạt động thành công',
                result,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin nhật ký hoạt động thất bại',
                error,
            },
            { status: 500 }
        )
    }
}
