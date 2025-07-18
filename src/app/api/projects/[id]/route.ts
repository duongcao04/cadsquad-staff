import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = parseInt(params.id)

        // Validate project ID
        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            )
        }

        // Parse request body
        const body = await request.json()
        const { jobStatusId } = body

        // Validate jobStatusId
        if (!jobStatusId || typeof jobStatusId !== 'number') {
            return NextResponse.json(
                { error: 'jobStatusId is required and must be a number' },
                { status: 400 }
            )
        }

        // Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                jobStatus: true,
                memberAssign: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        // Check if the new job status exists
        const newJobStatus = await prisma.jobStatus.findUnique({
            where: { id: jobStatusId },
        })

        if (!newJobStatus) {
            return NextResponse.json(
                { error: 'Job status not found' },
                { status: 404 }
            )
        }

        // Update the project's job status
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                jobStatusId: jobStatusId,
                // If switching to a completed status, you might want to set completedAt
                ...(newJobStatus.title.toLowerCase().includes('completed') && {
                    completedAt: new Date(),
                }),
            },
            include: {
                jobStatus: true,
                memberAssign: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                    },
                },
            },
        })

        return NextResponse.json({
            message: 'Project status updated successfully',
            project: updatedProject,
        })
    } catch (error) {
        console.error('Error updating project status:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const projectId = Number(params.id)

    if (isNaN(projectId)) {
        return NextResponse.json(
            { message: 'Invalid project ID' },
            { status: 400 }
        )
    }

    try {
        const project = await prisma.project.update({
            where: { id: projectId },
            data: { deletedAt: new Date() }, // soft delete
        })

        return NextResponse.json(
            {
                message: 'Project soft-deleted successfully',
                data: project,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('[DELETE_PROJECT_ERROR]', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
