import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const jobStatusId = parseInt(id)

    if (isNaN(jobStatusId)) {
        return NextResponse.json(
            { success: false, message: 'Job status id không hợp lệ' },
            { status: 400 }
        )
    }

    try {
        const result = await prisma.jobStatus.findUnique({
            where: {
                id: jobStatusId,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Lấy thông tin trạng thái dự án thành công',
            result,
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Lấy thông tin trạng thái dự án thất bại',
                error,
            },
            { status: 500 }
        )
    }
}
