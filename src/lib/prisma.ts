import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is required')
}

const prisma = new PrismaClient({
	log: ['error'],
	errorFormat: 'pretty',
})
	; (async () => {
		try {
			await prisma.$connect()
			return prisma
		} catch (error) {
			console.error('Failed to connect to database:', error)
			throw error
		}
	})()


export default prisma
