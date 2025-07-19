import { NextResponse } from 'next/server'

import { ensureConnection } from '@/lib/prisma'

export async function GET() {
    try {
        const prisma = await ensureConnection()
        const jobStatuses = await prisma.jobStatus.findMany({
            orderBy: {
                order: 'asc',
            },
            include: {
                _count: {
                    select: {
                        projects: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: jobStatuses,
        })
    } catch (error) {
        console.error('Error fetching job statuses:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch job statuses',
            },
            { status: 500 }
        )
    }
}
