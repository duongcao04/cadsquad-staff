import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JOB_TYPES_DATA: Prisma.JobTypeCreateInput[] = [
	{
		"id": "2f9c6060-7f9b-42a5-b6fa-df3ac9627c42",
		"code": "F",
		"displayName": "Fiverr"
	},
	{
		"id": "f93c8c34-f85f-46b6-8dbf-b9e10fd2f3cb",
		"code": "G",
		"displayName": "Global"
	},
	{
		"id": "9c78d5e6-4f11-47d4-8cb3-dfe287d9b763",
		"code": "V",
		"displayName": "Vietnam"
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
