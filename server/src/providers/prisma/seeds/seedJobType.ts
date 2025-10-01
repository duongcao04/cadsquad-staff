import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JOB_TYPES_DATA: Prisma.JobTypeCreateInput[] = [
	{
		"id": "2f9c6060-7f9b-42a5-b6fa-df3ac9627c42",
		"code": "FV",
		"displayName": "Fiverr"
	},
	{
		"id": "f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb",
		"code": "OTH",
		"displayName": "Other"
	},
	{
		"id": "9c78d5e6-4f11-47d4-8cb3-dfe287d9b763",
		"code": "PCM",
		"displayName": "Corporation"
	},
	{
		"id": "f6e6bde7-6e4a-4dc5-b642-b32f6a8b64af",
		"code": "XP",
		"displayName": "Xplora"
	}
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
