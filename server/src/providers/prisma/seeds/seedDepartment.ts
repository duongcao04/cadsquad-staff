import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DEPARTMENTS_DATA: Prisma.DepartmentCreateInput[] = [
	{
		id: "5aac88f8-e4f7-47e2-a9ef-652c44116c8c",
		code: 'management',
		displayName: 'Management',
		hexColor: '#f65333', // đỏ
	},
	{
		id: "760a1ffa-2ce5-435c-b778-7a109b74e220",
		code: 'engineering',
		displayName: 'Engineering',
		hexColor: '#fda53c', // cam
	},
	{
		id: "e3551dd9-7be9-42f3-91e2-c826004b693d",
		code: 'sales-and-marketing',
		displayName: 'Sales & Marketing',
		hexColor: '#ffd633', // vàng
	},
	{
		id: "b92a66c3-a0e6-4b4c-a4c6-2759ea97a9c2",
		code: 'administration',
		displayName: 'Administration',
		hexColor: '#3cb371', // xanh lá
	},
	{
		id: "09f4216e-e20c-4bf5-aa3e-3c65da7613eb",
		code: 'finance-and-accounting',
		displayName: 'Finance & Accounting',
		hexColor: '#3b82f6', // xanh dương
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
