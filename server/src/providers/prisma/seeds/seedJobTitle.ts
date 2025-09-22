import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JOB_TITLES_DATA: Prisma.JobTitleCreateInput[] = [
	// IT / Engineering
	{ code: 'it', displayName: 'IT' },
	{ code: 'fullstack_dev', displayName: 'Developer' },
	{ code: 'qa_engineer', displayName: 'QA Engineer' },
	{ code: 'sys_admin', displayName: 'System Administrator' },
	{ code: 'devops', displayName: 'DevOps Engineer' },

	// Accounting & Finance
	{ code: 'accountant', displayName: 'Accountant' },
	{ code: 'payroll_specialist', displayName: 'Payroll Specialist' },
	{ code: 'tax_accountant', displayName: 'Tax Accountant' },
	{ code: 'chief_accountant', displayName: 'Chief Accountant' },
	{ code: 'financial_analyst', displayName: 'Financial Analyst' },

	// Marketing
	{ code: 'marketing_exec', displayName: 'Marketing Executive' },
	{ code: 'seo_specialist', displayName: 'SEO Specialist' },
	{ code: 'content_creator', displayName: 'Content Creator' },
	{ code: 'digital_marketer', displayName: 'Digital Marketer' },

	// Sales
	{ code: 'sales_exec', displayName: 'Sales Executive' },
	{ code: 'sales_manager', displayName: 'Sales Manager' },
	{ code: 'business_dev', displayName: 'Business Development' },

	// Operations
	{ code: 'operations_manager', displayName: 'Operations Manager' },
	{ code: 'logistics_coordinator', displayName: 'Logistics Coordinator' },
	{ code: 'supply_chain_officer', displayName: 'Supply Chain Officer' },

	// Customer Support
	{ code: 'customer_service', displayName: 'Customer Service Representative' },
	{ code: 'support_specialist', displayName: 'Support Specialist' },

	// Machine Engineer
	{ code: 'mechanical_engineer', displayName: 'Mechanical Engineer' },
	{ code: 'machine_design_engineer', displayName: 'Machine Design Engineer' },
	{ code: 'manufacturing_engineer', displayName: 'Manufacturing Engineer' },
	{ code: 'maintenance_engineer', displayName: 'Maintenance Engineer' },
	{ code: 'production_engineer', displayName: 'Production Engineer' },
	{ code: 'industrial_engineer', displayName: 'Industrial Engineer' },
	{ code: 'quality_engineer', displayName: 'Quality Engineer' },
	{ code: 'automation_engineer', displayName: 'Automation Engineer' },
	{ code: 'process_engineer', displayName: 'Process Engineer' },
	{ code: 'cnc_programmer', displayName: 'CNC Programmer' },
	{ code: 'tooling_engineer', displayName: 'Tooling Engineer' },
	{ code: 'reliability_engineer', displayName: 'Reliability Engineer' },

	// Management
	{ code: 'ceo', displayName: 'CEO' },
	{ code: 'coo', displayName: 'COO' },
	{ code: 'cto', displayName: 'CTO' },
	{ code: 'cfo', displayName: 'CFO' },
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
