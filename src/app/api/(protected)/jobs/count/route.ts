import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTabQuery } from '../utils/getTabQuery'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tabQuery = searchParams.get('tab')
    const tab = tabQuery ?? 'active'

    try {
        const result = await prisma.job.count({ where: getTabQuery(tab) })

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
