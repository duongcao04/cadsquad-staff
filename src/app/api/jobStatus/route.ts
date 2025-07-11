import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

// GET - Fetch all job statuses
export async function GET() {
    try {
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

// POST - Create a new job status
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.title || !body.thumbnail) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title and thumbnail are required fields',
                },
                { status: 400 }
            )
        }

        // Check if job status with same title already exists
        const existingJobStatus = await prisma.jobStatus.findFirst({
            where: {
                title: body.title,
            },
        })

        if (existingJobStatus) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Job status with this title already exists',
                },
                { status: 409 }
            )
        }

        // Create new job status
        const newJobStatus = await prisma.jobStatus.create({
            data: {
                title: body.title,
                thumbnail: body.thumbnail,
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: newJobStatus,
                message: 'Job status created successfully',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating job status:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create job status',
            },
            { status: 500 }
        )
    }
}

// Clean up Prisma connection on module exit
process.on('beforeExit', async () => {
    await prisma.$disconnect()
})
