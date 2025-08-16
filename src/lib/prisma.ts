import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
}

/**
 * Accelerate for use service global DB online
 * !https://console.prisma.io/cmcsz5xd100vuw50w9gim3z0c/overview
 */
const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
})

;(async () => {
    try {
        await prisma.$connect()
        return prisma
    } catch (error) {
        console.error('Failed to connect to database:', error)
        throw error
    }
})()

export default prisma
