import { PrismaClient } from '@/generated/prisma'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
}

const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

// Helper function to ensure connection
export const ensureConnection = async () => {
    try {
        await prisma.$connect()
        return prisma
    } catch (error) {
        console.error('Failed to connect to database:', error)
        throw error
    }
}

// Prisma with ensure connection
export const prismaClient = await ensureConnection()

export default prisma

export type PrismaClientType = typeof prisma
