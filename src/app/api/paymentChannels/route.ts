import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const paymentChannels = await prisma.paymentChannel.findMany({
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
            data: paymentChannels,
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
