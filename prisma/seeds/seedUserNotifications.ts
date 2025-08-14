import { Notification, PrismaClient, User } from '@prisma/client'

export const seedUserNotifications = async (
    prisma: PrismaClient,
    users: User[],
    notifications: Notification[]
) => {
    console.log('Seeding user notifications...')

    const userNotifications = await Promise.all([
        prisma.userNotification.upsert({
            where: { id: 1 },
            update: {},
            create: {
                userId: users[1].id, // John Doe
                notificationId: notifications[0].id,
                status: 'SEEN',
            },
        }),
        prisma.userNotification.upsert({
            where: { id: 2 },
            update: {},
            create: {
                userId: users[4].id, // Sarah Wilson
                notificationId: notifications[0].id,
                status: 'UNSEEN',
            },
        }),
        prisma.userNotification.upsert({
            where: { id: 3 },
            update: {},
            create: {
                userId: users[3].id, // Mike Johnson
                notificationId: notifications[1].id,
                status: 'SEEN',
            },
        }),
        prisma.userNotification.upsert({
            where: { id: 4 },
            update: {},
            create: {
                userId: users[1].id, // John Doe
                notificationId: notifications[2].id,
                status: 'UNSEEN',
            },
        }),
        prisma.userNotification.upsert({
            where: { id: 5 },
            update: {},
            create: {
                userId: users[2].id, // Jane Smith
                notificationId: notifications[3].id,
                status: 'UNSEEN',
            },
        }),
    ])

    console.log(`✅ Created ${userNotifications.length} user notifications`)
    return userNotifications
}
