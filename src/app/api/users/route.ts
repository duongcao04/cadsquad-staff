'use server'

import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
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
                        price: true,
                        status: true,
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
