import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JOB_TITLES_DATA: Prisma.JobTitleCreateInput[] = [
	{ id: '8f49df5c-5d6b-48ea-9f8a-0b7e8e727f68', code: 'mobile_dev', displayName: 'Mobile Developer' },
	{ id: '7b9370c6-0873-4690-8e6c-7469f2a9a68f', code: 'web_dev', displayName: 'Web Developer' },
	{ id: 'f4c342b2-0f5e-4b73-a5ff-30dbf24a7762', code: 'sys_admin', displayName: 'System Administrator' },

	{ id: '8f1f0f3e-d828-45db-9a19-1a30a0c0c5a5', code: 'accountant', displayName: 'Accountant' },
	{ id: '7c6d12b1-bbb4-44f7-88af-25746a9c9eb8', code: 'tax_accountant', displayName: 'Tax Accountant' },

	// Marketing
	{ id: '4b6c02ae-2f8d-4baf-95f4-143bfe4a17e3', code: 'seo_specialist', displayName: 'SEO Specialist' },
	{ id: '2b67fc5b-4f36-4d9d-9c7b-97e4d1f776b4', code: 'content_creator', displayName: 'Content Creator' },

	// Sales
	{ id: '38f1c86e-8db3-4a1b-b2d4-97216ec2a1d4', code: 'sales_exec', displayName: 'Sales Executive' },
	{ id: '7d593b87-0cd1-44e0-84e5-fac6c079f97d', code: 'sales_manager', displayName: 'Sales Manager' },

	// Customer Support
	{ id: '0d8d3d59-f1cb-48ff-b815-21cb930f5e67', code: 'customer_service', displayName: 'Customer Service Representative' },
	{ id: '3d745eb0-4cc7-442f-bf0c-bdfdd7a9935a', code: 'support_specialist', displayName: 'Support Specialist' },

	// Machine Engineer
	{ id: 'e8c4a5b4-1af9-44a6-8d0d-d5f3c9fa07ef', code: 'mechanical_engineer', displayName: 'Mechanical Engineer' },
	{ id: '5d6c1d5d-3d64-4720-b9b8-72a1a89b0eb9', code: 'machine_design_engineer', displayName: 'Machine Design Engineer' },
	{ id: 'fb2c6c56-7e07-4b82-b2f6-290d9c6d8f9b', code: 'manufacturing_engineer', displayName: 'Manufacturing Engineer' },
	{ id: '26e5f7f1-1b6f-4db0-baf4-1cf7cde271ab', code: 'maintenance_engineer', displayName: 'Maintenance Engineer' },
	{ id: 'dd30de6d-cc28-4d49-a9e1-3f6a8d71a97e', code: 'production_engineer', displayName: 'Production Engineer' },
	{ id: '4f7aebc1-10a4-4a5a-8a07-82778c4a3056', code: 'industrial_engineer', displayName: 'Industrial Engineer' },
	{ id: '16c7c34e-85f4-4d34-a657-89601b7f40a0', code: 'quality_engineer', displayName: 'Quality Engineer' },
	{ id: 'c5b9c2ed-f032-41b0-bf63-d846b8fc6aa4', code: 'automation_engineer', displayName: 'Automation Engineer' },
	{ id: 'b2315ec2-9b67-457c-8260-1fc761db9c2a', code: 'process_engineer', displayName: 'Process Engineer' },
	{ id: '79b82a17-11b1-48c4-83f5-f3c9b24b7b0f', code: 'cnc_programmer', displayName: 'CNC Programmer' },
	{ id: 'd23f6d14-b5d8-4e2f-9ebf-6b9ef28f1dc8', code: 'tooling_engineer', displayName: 'Tooling Engineer' },
	{ id: '6fb479c3-d1cc-4a73-8b7a-1b80e50ec1c1', code: 'reliability_engineer', displayName: 'Reliability Engineer' },

	// Management
	{ id: '4a1fdd62-b77d-4c18-a7b6-56c7f44a4d1e', code: 'ceo', displayName: 'CEO' },
	{ id: '8c7fd9a4-2d2e-47ab-93d0-28b4b58de9c7', code: 'coo', displayName: 'COO' },
	{ id: '37c6fb5a-0b0e-4b5d-8c9c-8cfe8b7ecb14', code: 'cto', displayName: 'CTO' },
	{ id: 'b0d91d34-f5f1-4b94-9b29-3c0c24e20e91', code: 'cfo', displayName: 'CFO' },
]


export const seedJobTitle = async (prisma: PrismaClient) => {
	const result = await Promise.all(
		JOB_TITLES_DATA.map((data) => {
			return prisma.jobTitle.create({
				data: data,
			})
		}),
	)
	return result
}

seedJobTitle(prisma).then(() => {
	console.log('Seed job title successfully!')
})
