import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DEPARTMENTS_DATA: Prisma.DepartmentCreateInput[] = [
	{
		code: 'it',
		displayName: 'IT',
	},
	{
		code: 'finance-accounting',
		displayName: 'Finance & Accounting',
	},
	{
		code: 'engineering',
		displayName: 'Engineering',
	},
	{
		code: 'management',
		displayName: 'Management',
	},
]

export const seedDepartment = async (prisma: PrismaClient) => {
	const result = await Promise.all(
		DEPARTMENTS_DATA.map((data) => {
			return prisma.department.create({
				data: data,
			})
		}),
	)
	return result
}

seedDepartment(prisma).then(() => {
	console.log('Seed department successfully!')
})
