import { NextRequest, NextResponse } from 'next/server'

import { ensureConnection } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    const prisma = await ensureConnection()
    try {
        const body = await request.json()
        const { recipientId, title, content, image } = body

        // Validate required fields
        if (!recipientId || !content) {
            return NextResponse.json(
                { error: 'Recipient ID and content are required' },
                { status: 400 }
            )
        }

        // Verify recipient exists
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId },
            select: { id: true, name: true },
        })

        if (!recipient) {
            return NextResponse.json(
                { error: 'Recipient not found' },
                { status: 404 }
            )
        }

        // Create notification and user notification in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the notification
            const notification = await tx.notification.create({
                data: {
                    title,
                    content,
                    image,
                },
            })

            // Create the user notification relationship
            const userNotification = await tx.userNotification.create({
                data: {
                    userId: recipientId,
                    notificationId: notification.id,
                    status: 'UNSEEN',
                },
            })

            return {
                notification,
                userNotification,
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Notification sent successfully',
                data: {
                    notificationId: result.notification.id,
                    recipientId: recipientId,
                    recipientName: recipient.name,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error sending notification:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
