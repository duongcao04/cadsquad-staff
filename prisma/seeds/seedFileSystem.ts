import { PrismaClient, User } from '@/generated/prisma'
import prisma from '@/lib/prisma'

const fileSystem = [
    {
        id: 999999,
        name: 'Documents',
        type: 'folder' as const,
        size: '0 KB',
        items: 5,
        path: ['root'],
        color: '#3B82F6',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999998,
        name: 'Project Center',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999997,
        name: 'Team',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999996,
        name: 'C-001. Machine Calculation',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999995,
        name: 'C-002. Structure Calculation',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999994,
        name: 'D-001. Tutorials',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999993,
        name: 'D-002. Academy',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999992,
        name: 'D-003. Practices',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999991,
        name: 'D-004. WorldSkills',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999990,
        name: 'D-005. Subjects',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999989,
        name: 'D-006. Guide Videos',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999988,
        name: 'D-007. Mechanical References',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999987,
        name: 'D-008. Steel Structure References',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Documents'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999986,
        name: 'OTH- OTHER',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Project Center'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999985,
        name: 'PCM- CORPORATION',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Project Center'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999984,
        name: 'XP- XPLORA',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Project Center'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999983,
        name: 'FV- FIVERR',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Project Center'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999982,
        name: '_Sports and Entertaiment',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999981,
        name: '01. Announcements',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999980,
        name: '02. Meeting Notes',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999979,
        name: '03. Innovation Hub',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999978,
        name: 'BTK.VANG',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999977,
        name: 'CH.DUONG',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999976,
        name: 'DC.SON',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999975,
        name: 'DQ.TRONG',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999974,
        name: 'HH.DANG',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999973,
        name: 'LT.DAT',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999972,
        name: 'NC.HIEU',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 999971,
        name: 'NKH.MINH',
        type: 'folder' as const,
        size: '0 KB',
        items: 12,
        path: ['root', 'Team'],
        color: '#EC4899',
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 2],
    },
    {
        id: 3,
        name: 'requirements.pdf',
        type: 'file' as const,
        size: '2.4 MB',
        items: null,
        path: ['root', 'Documents'],
        color: null,
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [1, 2],
    },
    {
        id: 4,
        name: 'mockups.fig',
        type: 'file' as const,
        size: '8.7 MB',
        items: null,
        path: ['root', 'Documents'],
        color: null,
        createdById: 2, // Duong Cao
        visibleToUserIndexes: [4, 1, 2],
    },
]

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const seedFileSystem = async (prisma: PrismaClient, users: User[]) => {
    console.log('Seeding file system...')

    const filesCreated = []

    for (let i = 0; i < fileSystem.length; i++) {
        const fileData = fileSystem[i]

        // Create the file system item
        const createdFile = await prisma.fileSystem.upsert({
            where: { id: fileData.id },
            update: {},
            create: {
                name: fileData.name,
                type: fileData.type,
                size: fileData.size,
                items: fileData.items,
                path: fileData.path,
                color: fileData.color,
                createdById: users[fileData.createdById].id,
                visibleToUsers: {
                    connect: fileData.visibleToUserIndexes.map((index) => ({
                        id: users[index].id,
                    })),
                },
            },
        })

        filesCreated.push(createdFile)

        // Wait 3000ms after every 6 items (but not after the last item)
        if ((i + 1) % 6 === 0 && i < fileSystem.length - 1) {
            console.log(`⏳ Processed ${i + 1} items. Waiting 3000ms...`)
            await delay(3000)
        }
    }

    console.log(`✅ Created ${filesCreated.length} file system items`)
    return filesCreated
}

// Alternative approach using batch processing with delays
export const seedFileSystemBatch = async (
    prisma: PrismaClient,
    users: User[]
) => {
    console.log('Seeding file system with batch processing...')

    const filesCreated = []
    const batchSize = 6

    for (let i = 0; i < fileSystem.length; i += batchSize) {
        const batch = fileSystem.slice(i, i + batchSize)

        console.log(
            `📦 Processing batch ${Math.floor(i / batchSize) + 1} (items ${i + 1}-${Math.min(i + batchSize, fileSystem.length)})`
        )

        // Process current batch
        const batchResults = await Promise.all(
            batch.map(async (fileData) => {
                return prisma.fileSystem.upsert({
                    where: { id: fileData.id },
                    update: {},
                    create: {
                        name: fileData.name,
                        type: fileData.type,
                        size: fileData.size,
                        items: fileData.items,
                        path: fileData.path,
                        color: fileData.color,
                        createdById: users[fileData.createdById].id,
                        visibleToUsers: {
                            connect: fileData.visibleToUserIndexes.map(
                                (index) => ({
                                    id: users[index].id,
                                })
                            ),
                        },
                    },
                })
            })
        )

        filesCreated.push(...batchResults)

        // Wait 3000ms after each batch (except the last one)
        if (i + batchSize < fileSystem.length) {
            console.log(
                `⏳ Batch completed. Waiting 3000ms before next batch...`
            )
            await delay(3000)
        }
    }

    console.log(`✅ Created ${filesCreated.length} file system items`)
    return filesCreated
}
;(async function () {
    const users = await prisma.user.findMany()

    // Use either approach:
    // Sequential processing with delays
    await seedFileSystem(prisma, users)

    // Or batch processing with delays
    // await seedFileSystemBatch(prisma, users)
})()
