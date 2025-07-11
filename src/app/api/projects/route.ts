'use server'

import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search')

        const where = {
            ...(search && {
                OR: [
                    {
                        jobName: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                    {
                        jobNo: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                ],
            }),
        }

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
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
                    jobStatus: {},
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.project.count({ where }),
        ])

        return NextResponse.json({
            data: projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { memberAssignIds, jobStatusId, ...projectData } = body

        // Validate required fields
        if (!projectData.jobNo || !projectData.jobName) {
            return NextResponse.json(
                { error: 'Job number and job name are required' },
                { status: 400 }
            )
        }

        // Check if jobNo already exists
        const existingProject = await prisma.project.findUnique({
            where: { jobNo: projectData.jobNo },
        })

        if (existingProject) {
            return NextResponse.json(
                { error: 'Job number already exists' },
                { status: 400 }
            )
        }

        // Create project with members
        const project = await prisma.project.create({
            data: {
                jobNo: projectData.jobNo,
                jobName: projectData.jobName,
                price: Number(projectData.price),
                sourceUrl: projectData.sourceUrl,
                startedAt: projectData.startedAt
                    ? new Date(projectData.startedAt)
                    : new Date(),
                dueAt: new Date(projectData.dueAt),
                completedAt: projectData.completedAt
                    ? new Date(projectData.completedAt)
                    : null,
                jobStatus: {
                    connect: {
                        id: jobStatusId,
                    },
                },
                // Conditionally add memberAssign only if memberAssignIds exists and has items
                ...(memberAssignIds &&
                    memberAssignIds.length > 0 && {
                        memberAssign: {
                            connect: memberAssignIds.map((id: string) => ({
                                id,
                            })),
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
        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
