import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

// GET - Fetch all job statuses
export async function GET() {
    try {
        const jobTypes = await prisma.jobType.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                projects: {},
                _count: {
                    select: {
                        projects: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: jobTypes,
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
