import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JOB_TYPES_DATA: Prisma.JobTypeCreateInput[] = [
	{
		code: 'FV',
		displayName: 'Fiverr',
	},
	{
		code: 'OTH',
		displayName: 'Other',
	},
	{
		code: 'PCM',
		displayName: 'Corporation',
	},
	{
		code: 'XP',
		displayName: 'Xplora',
	},
]

export const seedJobType = async (prisma: PrismaClient) => {
	const result = await Promise.all(
		JOB_TYPES_DATA.map((jType) => {
			return prisma.jobType.create({
				data: jType,
			})
		}
		)
	)

	return result
}

seedJobType(prisma).then(() => {
	console.log('Seed job types successfully!')
})
