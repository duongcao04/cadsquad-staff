import { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

const jobTypes = [
    {
        id: 1,
        code: 'FV',
        name: 'Fiverr',
    },
    {
        id: 2,
        code: 'OTH',
        name: 'Other',
    },
    {
        id: 3,
        code: 'PCM',
        name: 'Corporation',
    },
    {
        id: 4,
        code: 'XP',
        name: 'Xplora',
    },
]

export const seedJobStatuses = async (prisma: PrismaClient) => {
    console.log('Seeding job types...')
    console.log('---------------------------------------')

    const jobTypesCreated = await Promise.all(
        jobTypes.map((jType) => {
            console.log(jType.code, ".", jType.code, ":::", jType.name);

            return prisma.jobType.upsert({
                where: { id: jType.id },
                update: {},
                create: jType,
            })
        }
        )
    )

    console.log('---------------------------------------')
    console.log(`✅ Created ${jobTypesCreated.length} job types`)
    return jobTypesCreated
}

seedJobStatuses(prisma)
