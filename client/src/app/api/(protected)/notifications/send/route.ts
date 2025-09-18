import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { senderId, recipientId, title, content, image } = body

        // Validate required fields
        if (!recipientId || !content) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Recipient ID and content are required',
                },
                { status: 400 }
            )
        }

        // Validate recipientId is a number
        if (typeof recipientId !== 'number') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Recipient ID must be a valid number',
                },
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
                {
                    success: false,
                    message: 'Recipient not found',
                },
                { status: 404 }
            )
        }

        // Verify sender exists if senderId is provided
        if (senderId) {
            const sender = await prisma.user.findUnique({
                where: { id: senderId },
                select: { id: true },
            })

            if (!sender) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Sender not found',
                    },
                    { status: 404 }
                )
            }
        }

        // Create notification and user notification in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the notification with proper senderId handling
            const notification = await tx.notification.create({
                data: {
                    userId: recipientId,
                    senderId: senderId ?? null,
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
                    senderId: senderId || null,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error sending notification:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
            },
            { status: 500 }
        )
    }
}
