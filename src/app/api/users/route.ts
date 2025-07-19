'use server'

import { NextRequest, NextResponse } from 'next/server'

import { ensureConnection } from '@/lib/prisma'

export async function GET() {
    try {
        const prisma = await ensureConnection()
        const users = await prisma.user.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                assignedProjects: {},
                createdProjects: {},
                statusChanges: {},
                notifications: {},
                _count: {
                    select: {
                        assignedProjects: true,
                        createdProjects: true,
                        notifications: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: users,
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch users',
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const prisma = await ensureConnection()

        const existingEmail = await prisma.user.findUnique({
            where: { email: body.email },
        })
        const existingUsername = await prisma.user.findUnique({
            where: { username: body.username },
        })

        if (existingEmail || existingUsername) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Create project with members
        const user = await prisma.user.create({
            data: {
                id: body.id,
                email: body.email,
                username: body.username,
                name: body.name,
                avatar: body.avatar,
                jobTitle: body.jobTitle,
                department: body.department,
                role: body.role || 'USER',
            },
            include: {
                assignedProjects: {
                    select: {
                        id: true,
                        jobNo: true,
                        jobName: true,
                        staffCost: true,
                    },
                },
            },
        })
        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
