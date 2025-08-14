import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const page = parseInt(searchParams.get('page') || '1')
	const limit = parseInt(searchParams.get('limit') || '10')
	const search = searchParams.get('search')
	const jobNo = searchParams.get('jobNo')
	const tab = searchParams.get('tab')

	// 1. Get by Job No.
	if (jobNo) {
		try {
			const result = await prisma.job.findUnique({
				where: {
					jobNo: jobNo,
					deletedAt: null,
				},
				include: {
					paymentChannel: {},
					memberAssign: {
						select: {
							id: true,
							name: true,
							email: true,
							jobTitle: true,
							department: true,
							avatar: true,
						},
					},
					jobStatus: {},
					statusChanges: {},
					createdBy: {},
					jobType: {},
					timeEntries: {},
					files: {},
					_count: {
						select: {
							memberAssign: true,
							files: true
						}
					}
				},
			})
			if (!result) {
				return NextResponse.json({
					success: false,
					message: `Lấy thông tin dự án ${jobNo} thất bại`,
					error: "Not Found",
				}, {
					status: 404
				})
			}

			return NextResponse.json({
				success: true,
				message: `Lấy thông tin dự án ${jobNo} thành công`,
				result,
			})
		} catch (error) {
			return NextResponse.json({
				success: false,
				message: `Lấy thông tin dự án ${jobNo} thất bại`,
				error,
			}, {
				status: 500
			})
		}
	}

	/**
	 * 2. Get by Tab
	 * - @priorityFilter Dự án gần hét hạn. < 1 ngày
	 * - @activeFilter Toàn bộ dự án được giao
	 * - @completedFilter Dự án đã hoàn thành
	 * - @deliveredFilter Dự án đã giao
	 * - @lateFilter Dự án trễ hạn
	 * - @cancelledFilter Dự án đã hủy (delete)
	 */
	if (tab) {
		try {
			const today = dayjs().startOf('day').toDate()
			const dayAfterTomorrow = dayjs()
				.add(2, 'day')
				.startOf('day')
				.toDate()

			let where: Record<string, unknown> = {
				deletedAt: null,
			}

			const priorityFilter = {
				...where,
				dueAt: {
					gte: today,
					lt: dayAfterTomorrow, // trước ngày kia, tức là chỉ trong 2 ngày gần nhất (nay + mai)
				},
			}
			const activeFilter = where
			const completedFilter = {
				...where,
				jobStatus: {
					is: {
						title: 'Completed',
					},
				},
			}
			const deliveredFilter = {
				...where,
				jobStatus: {
					is: {
						title: 'Delivered',
					},
				},
			}
			const lateFilter = {
				...where,
				AND: [
					{
						dueAt: {
							lte: today,
						},
					},
					{
						jobStatus: {
							NOT: {
								title: 'Completed',
							},
						},
					},
				],
			}
			const cancelledFilter = {
				deletedAt: { not: null },
			}

			switch (tab) {
				case 'priority':
					where = priorityFilter
					break
				case 'active':
					where = activeFilter
					break
				case 'completed':
					where = completedFilter
					break
				case 'delivered':
					where = deliveredFilter
					break
				case 'late':
					where = lateFilter
					break
				case 'cancelled':
					where = cancelledFilter
					break
				default:
					break
			}

			// Get counts for all workflow statuses
			const counts = await Promise.all([
				prisma.job.count({ where: priorityFilter }),
				prisma.job.count({ where: activeFilter }),
				prisma.job.count({ where: completedFilter }),
				prisma.job.count({ where: deliveredFilter }),
				prisma.job.count({ where: lateFilter }),
				prisma.job.count({ where: cancelledFilter }),
			])

			const countsByTab = {
				priority: counts[0],
				active: counts[1],
				completed: counts[2],
				delivered: counts[3],
				late: counts[4],
				cancelled: counts[5],
			}

			const jobs = await prisma.job.findMany({
				where,
				include: {
					paymentChannel: {},
					memberAssign: {
						select: {
							id: true,
							name: true,
							email: true,
							jobTitle: true,
							department: true,
							avatar: true,
						},
					},
					jobStatus: {},
					statusChanges: {},
					createdBy: {},
					jobType: {},
					timeEntries: {},
					files: {},
					_count: {
						select: {
							memberAssign: true,
							files: true
						}
					}
				},
				orderBy: { createdAt: 'desc' },
			})

			if (!jobs) {
				return NextResponse.json({
					success: false,
					message: `Lấy thông tin dự án theo tab ${tab} thất bại`,
					error: "Not Found",
				}, {
					status: 404
				})
			}

			return NextResponse.json({
				success: true,
				message: `Lấy thông tin dự án theo tab ${tab} thành công`,
				result: {
					jobs,
					counts: countsByTab
				},
			})
		} catch (error) {
			return NextResponse.json({
				success: false,
				message: `Lấy thông tin dự án theo tab ${tab} thất bại`,
				error,
			}, {
				status: 500
			})
		}
	}

	// 3. Get all
	try {
		const where = {
			deletedAt: null,
			...(search && {
				OR: [
					{
						jobName: {
							contains: search,
							mode: 'insensitive' as const,
						},
					},
					{
						jobNo: {
							contains: search,
							mode: 'insensitive' as const,
						},
					},
				],
			}),
		}

		const [jobs, total] = await Promise.all([
			prisma.job.findMany({
				where,
				include: {
					paymentChannel: {},
					memberAssign: {
						select: {
							id: true,
							name: true,
							email: true,
							jobTitle: true,
							department: true,
							avatar: true,
						},
					},
					jobStatus: {},
					statusChanges: {},
					createdBy: {},
					jobType: {},
					timeEntries: {},
					files: {},
					_count: {
						select: {
							memberAssign: true,
							files: true
						}
					}
				},
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
			}),
			prisma.job.count({ where }),
		])

		if (!jobs || jobs.length === 0) {
			return NextResponse.json({
				success: false,
				message: `Lấy danh sách thông tin dự án thất bại`,
				error: "Not Found",
			}, {
				status: 404
			})
		}

		const result = jobs
		const meta = {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		}
		return NextResponse.json({
			success: true,
			message: "Lấy danh sách thông tin dự án thành công",
			result,
			meta
		}, {
			status: 200
		})
	} catch (error) {
		return NextResponse.json({
			success: false,
			message: `Lấy danh sách thông tin dự án thất bại`,
			error,
		}, {
			status: 500
		})
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const jobData = body

		console.log(jobData);


		const jobCreated = await prisma.job.create({
			data: {
				jobNo: jobData.jobNo,
				jobName: jobData.jobName,
				clientName: jobData.clientName,
				income: Number(jobData.income),
				staffCost: Number(jobData.staffCost),
				sourceUrl: jobData.sourceUrl,
				startedAt: jobData.startedAt
					? new Date(jobData.startedAt)
					: new Date(),
				dueAt: new Date(jobData.dueAt),
				completedAt: jobData.completedAt
					? new Date(jobData.completedAt)
					: null,
				jobStatus: {
					connect: {
						id: Number(jobData.jobStatusId),
					},
				},
				jobType: {
					connect: {
						id: Number(jobData.jobTypeId),
					},
				},
				paymentChannel: {
					connect: {
						id: Number(jobData.paymentChannelId),
					},
				},
				createdBy: {
					connect: {
						id: jobData.createdById,
					},
				},
				// Conditionally add memberAssign only if memberAssignIds exists and has items
				...(jobData.memberAssignIds &&
					jobData.memberAssignIds.length > 0 && {
					memberAssign: {
						connect: jobData.memberAssignIds.map(
							(id: string) => ({
								id,
							})
						),
					},
				}),
			},
			include: {
				memberAssign: {
					select: {
						id: true,
						name: true,
						email: true,
						jobTitle: true,
						department: true,
						avatar: true,
					},
				},
			},
		})
		return NextResponse.json(
			{
				success: true,
				message: "Tạo mới dự án thành công",
				result: jobCreated,
			},
			{ status: 201 }
		)
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				success: false,
				message: "Tạo mới dự án thất bại",
				error: "Error"
			},
			{ status: 500 }
		)
	}
}
