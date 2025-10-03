import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const JOB_STATUSES_DATA: Prisma.JobStatusCreateInput[] = [
	{
		"id": "f6db8c15-94cb-47d4-9d73-3b72c0dd19a7",
		"displayName": "In Progress",
		"code": "in-progress",
		"thumbnailUrl": "https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_IN_PROGRESS_oofjpd.png",
		"hexColor": "#dc9b40",
		"icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-loader-icon lucide-loader\"><path d=\"M12 2v4\"/><path d=\"m16.2 7.8 2.9-2.9\"/><path d=\"M18 12h4\"/><path d=\"m16.2 16.2 2.9 2.9\"/><path d=\"M12 18v4\"/><path d=\"m4.9 19.1 2.9-2.9\"/><path d=\"M2 12h4\"/><path d=\"m4.9 4.9 2.9 2.9\"/></svg>",
		"nextStatusOrder": 2,
		"order": 1
	},
	{
		"id": "e5a8c177-8a69-4f9c-8f4d-bb7c2f43d11a",
		"displayName": "Delivered",
		"code": "delivered",
		"thumbnailUrl": "https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-DELIVERED_tsnmqv.png",
		"hexColor": "#960ebf",
		"icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-package-check-icon lucide-package-check\"><path d=\"m16 16 2 2 4-4\"/><path d=\"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14\"/><path d=\"m7.5 4.27 9 5.15\"/><polyline points=\"3.29 7 12 12 20.71 7\"/><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"12\"/></svg>",
		"nextStatusOrder": 3,
		"prevStatusOrder": 4,
		"order": 2
	},
	{
		"id": "0fd0a749-48e4-4c89-9bbd-6f21542c11d3",
		"displayName": "Completed",
		"code": "completed",
		"thumbnailUrl": "https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159964/Cadsquad/STAFF/JOB_STATUS/JOB-_COMPLETED_e0xlg9.png",
		"hexColor": "#5f8fe8",
		"icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-circle-check-big-icon lucide-circle-check-big\"><path d=\"M21.801 10A10 10 0 1 1 17 3.335\"/><path d=\"m9 11 3 3L22 4\"/></svg>",
		"nextStatusOrder": 5,
		"order": 3
	},
	{
		"id": "9b8dcb2c-f7cf-440f-95de-7c16bb4f34de",
		"displayName": "Revision",
		"code": "revision",
		"thumbnailUrl": "https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159955/Cadsquad/STAFF/JOB_STATUS/JOB_IN_REVISION_pu2pnu.png",
		"hexColor": "#de575b",
		"icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-refresh-ccw-icon lucide-refresh-ccw\"><path d=\"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16\"/><path d=\"M16 16h5v5\"/></svg>",
		"nextStatusOrder": 2,
		"order": 4
	},
	{
		"id": "3c7d3db5-20f3-4675-8e5d-0f6fc53e1dc8",
		"displayName": "Finish",
		"code": "finish",
		"thumbnailUrl": "https://res.cloudinary.com/dqx1guyc0/image/upload/v1752159965/Cadsquad/STAFF/JOB_STATUS/JOB-_FINISH_xipa75.png",
		"hexColor": "#64b249",
		"icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-hand-coins-icon lucide-hand-coins\"><path d=\"M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17\"/><path d=\"m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9\"/><path d=\"m2 16 6 6\"/><circle cx=\"16\" cy=\"9\" r=\"2.9\"/><circle cx=\"6\" cy=\"5\" r=\"3\"/></svg>",
		"order": 5
	}
]

export const seedJobStatus = async (prisma: PrismaClient) => {
	const result = await Promise.all(
		JOB_STATUSES_DATA.map((statusData) => {
			return prisma.jobStatus.create({
				data: statusData,
			})
		})
	)
	return result
}

seedJobStatus(prisma).then(() => {
	console.log("Seed job status successfully!");
})