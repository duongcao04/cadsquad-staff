'use server'

import { NextResponse } from 'next/server'

import { getSession } from '@/lib/auth/session'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const currentUserId = await getSession()
        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get notifications sent to the current user
        const notifications = await prisma.userNotification.findMany({
            where: { userId: currentUserId.user.id },
            include: {
                notification: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                notification: {
                    createdAt: 'desc',
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: notifications,
        })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
