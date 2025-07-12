import { PrismaClient } from '@/generated/prisma'
import prisma from '@/lib/prisma'

const jobStatuses = [
    {
        id: 1,
        title: 'In Progress',
        thumbnail:
            'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_IN_PROGRESS_oofjpd.png',
        color: '#ffde59',
        order: 1,
    },
    {
        id: 2,
        title: 'Completed',
        thumbnail:
            'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159964/Cadsquad/STAFF/JOB_STATUS/JOB-_COMPLETED_e0xlg9.png',
        color: '#3db8f3',
        order: 2,
    },
    {
        id: 3,
        title: 'Revision',
        thumbnail:
            'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159955/Cadsquad/STAFF/JOB_STATUS/JOB_IN_REVISION_pu2pnu.png',
        color: '#ff65c3',
        order: 3,
    },
    {
        id: 4,
        title: 'Delivered',
        thumbnail:
            'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-DELIVERED_tsnmqv.png',
        color: '#ca6ce6',
        order: 4,
    },
    {
        id: 5,
        title: 'Finish',
        thumbnail:
            'https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_FINISH_xipa75.png',
        color: '#00be63',
        order: 5,
    },
]

export const seedJobStatuses = async (prisma: PrismaClient) => {
    console.log('Seeding job statuses...')

    const jobStatusesCreated = await Promise.all(
        jobStatuses.map((statusData) =>
            prisma.jobStatus.upsert({
                where: { id: statusData.id },
                update: {},
                create: statusData,
            })
        )
    )

    console.log(`✅ Created ${jobStatusesCreated.length} job statuses`)
    return jobStatusesCreated
}

seedJobStatuses(prisma)
