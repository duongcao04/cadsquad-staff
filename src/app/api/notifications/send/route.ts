import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
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

        // Get current user ID from session/auth
        // Note: You'll need to implement your authentication logic here
        // This is a placeholder for getting the current user
        const currentUserId = await getCurrentUserId()

        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    } finally {
        await prisma.$disconnect()
    }
}

// Helper function to get current user ID
// You'll need to implement this based on your authentication system
async function getCurrentUserId(): Promise<string | null> {
    // Example implementations:

    // 1. Using JWT token from Authorization header
    // const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    // if (!token) return null;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return decoded.userId;

    // 2. Using session/cookies
    const { data } = await supabase.auth.getSession()
    return data.session?.user.id as string

    // 3. Using NextAuth
    // const token = await getToken({ req: request });
    // return token?.sub;

    // Placeholder - replace with your actual auth logic
    return null
}

// Optional: Add GET method to retrieve notification history
export async function GET() {
    try {
        const currentUserId = await getCurrentUserId()

        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get notifications sent to the current user
        const notifications = await prisma.userNotification.findMany({
            where: { userId: currentUserId },
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
    } finally {
        await prisma.$disconnect()
    }
}
