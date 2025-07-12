import { JobStatus, PrismaClient, User } from '@/generated/prisma'
import prisma from '@/lib/prisma'

import { generateRandomProjects } from './generate/generateProject'

export const seedProjects = async (
    prisma: PrismaClient,
    users: User[],
    jobStatuses: JobStatus[],
    count: number = 15
) => {
    console.log(`Seeding ${count} random mechanical engineering projects...`)

    const randomProjects = generateRandomProjects(count, users, jobStatuses, {
        year: 2024,
        minPrice: 25000,
        maxPrice: 150000,
        minTeamSize: 1,
        maxTeamSize: 4,
        startDateRange: {
            start: new Date(2024, 0, 1),
            end: new Date(2024, 6, 31),
        },
        durationRange: { min: 3, max: 10 },
    })

    const projects = await Promise.all(
        randomProjects.map((projectData) =>
            prisma.project.upsert({
                where: { jobNo: projectData.jobNo },
                update: {},
                create: projectData,
            })
        )
    )

    console.log(
        `✅ Created ${projects.length} random mechanical engineering projects`
    )
    return projects
}
;(async function () {
    const users = (await prisma.user.findMany()).filter(
        (item) => item.department === 'Engineering'
    )
    const jobStatuses = await prisma.jobStatus.findMany()
    seedProjects(prisma, users, jobStatuses, 16)
})()
