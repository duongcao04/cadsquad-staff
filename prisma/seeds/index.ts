import { PrismaClient } from '@prisma/client'

import { seedFileSystem } from './seedFileSystem'
import { seedJobStatuses } from './seedJobStatuses'
import { seedNotifications } from './seedNotifications'
import { seedProjects } from './seedProjects'
import { seedUserNotifications } from './seedUserNotifications'
import { seedUsers } from './seedUsers'

const prisma = new PrismaClient()

const main = async () => {
    const start = Date.now()
    console.log('🌱 Starting database seeding...')

    try {
        // Seed in order of dependencies
        const jobStatuses = await seedJobStatuses(prisma)
        const users = await seedUsers(prisma)
        const projects = await seedProjects(prisma, users, jobStatuses, 20)
        const fileSystems = await seedFileSystem(prisma, users)
        const notifications = await seedNotifications(prisma)
        const userNotifications = await seedUserNotifications(
            prisma,
            users,
            notifications
        )

        const end = Date.now()
        console.log(`\n🎉 Seeding completed in ${end - start}ms`)
        console.log(`\n📊 Summary:`)
        console.log(`  - ${jobStatuses.length} job statuses`)
        console.log(`  - ${users.length} users`)
        console.log(`  - ${projects.length} projects`)
        console.log(`  - ${fileSystems.length} file system items`)
        console.log(`  - ${notifications.length} notifications`)
        console.log(`  - ${userNotifications.length} user notifications`)

        return {
            users,
            jobStatuses,
            projects,
            fileSystems,
            notifications,
            userNotifications,
        }
    } catch (error) {
        console.error('❌ Error during seeding:', error)
        throw error
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    main()
        .then(() => {
            console.log('✅ Seeding completed successfully')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error)
            process.exit(1)
        })
}

export default main
