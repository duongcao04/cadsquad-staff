import { PrismaClient } from '@/generated/prisma'

export const seedNotifications = async (prisma: PrismaClient) => {
    console.log('Seeding notifications...')

    const notifications = await Promise.all([
        prisma.notification.upsert({
            where: { id: 1 },
            update: {},
            create: {
                title: 'Project Assignment',
                content:
                    'You have been assigned to the E-commerce Website Redesign project.',
                image: 'https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=📋',
            },
        }),
        prisma.notification.upsert({
            where: { id: 2 },
            update: {},
            create: {
                title: 'Status Update',
                content:
                    'The Data Analytics Dashboard project has been completed successfully.',
                image: 'https://via.placeholder.com/64x64/10B981/FFFFFF?text=✅',
            },
        }),
        prisma.notification.upsert({
            where: { id: 3 },
            update: {},
            create: {
                title: 'File Shared',
                content: 'New design mockups have been shared with you.',
                image: 'https://via.placeholder.com/64x64/EC4899/FFFFFF?text=📁',
            },
        }),
        prisma.notification.upsert({
            where: { id: 4 },
            update: {},
            create: {
                title: 'Deadline Reminder',
                content:
                    'The Mobile App Development project deadline is approaching.',
                image: 'https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=⏰',
            },
        }),
    ])

    console.log(`✅ Created ${notifications.length} notifications`)
    return notifications
}
