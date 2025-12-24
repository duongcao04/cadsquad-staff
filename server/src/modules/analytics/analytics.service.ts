import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { AnalyticsOverviewDto } from './dto/analytics-overview.dto';
import { Prisma, RoleEnum } from '@prisma/client';

// Load plugins
dayjs.extend(isSameOrBefore);

@Injectable()
export class AnalyticsService {
	constructor(private prisma: PrismaService) { }

	async getOverview(query: AnalyticsOverviewDto, userId: string) {
		const today = dayjs();

		// 1. Default Date Range (30 days if not provided)
		const startDate = query.startDate
			? dayjs(query.startDate).startOf('day')
			: today.subtract(30, 'day').startOf('day');

		const endDate = query.endDate
			? dayjs(query.endDate).endOf('day')
			: today.endOf('day');

		// --- 1. CARDS DATA ---
		const [activeJobs, overdueJobs, pendingReview, waitingPayment] = await Promise.all([
			this.prisma.job.count({
				where: { status: { systemType: { notIn: ['COMPLETED', 'TERMINATED'] } } }
			}),
			this.prisma.job.count({
				where: {
					dueAt: { lt: today.toDate() },
					status: { systemType: { notIn: ['COMPLETED', 'TERMINATED'] } }
				}
			}),
			this.prisma.job.count({
				where: { status: { code: { in: ['inprogressing', 'revision'] } } }
			}),
			this.prisma.job.count({
				where: { status: { systemType: 'COMPLETED' }, isPaid: false }
			})
		]);

		// --- 2. FINANCIAL OVERVIEW ---
		// Fetch daily data from the reusable analytics method
		const financialData = await this.getRevenueAnalytics(
			startDate.toISOString(),
			endDate.toISOString(),
			'day'
		);

		// Map to the specific format for your frontend chart: { name: 'Aug 01', income: 4000 }
		const financialChart = financialData.map(item => ({
			name: dayjs(item.dateObj).format('MMM DD'), // Formats '2024-08-01' to 'Aug 01'
			income: item.incomeCost
		}));
		// --- 3. TOP PERFORMERS (Sorted by Assignee Number / Job Count) ---
		let performerStartDate = today.subtract(7, 'day').startOf('day');
		if (query.period === '1m') performerStartDate = today.subtract(1, 'month').startOf('day');
		if (query.period === '1y') performerStartDate = today.subtract(1, 'year').startOf('day');

		const performers = await this.prisma.user.findMany({
			where: {
				isActive: true,
				// Only consider users who actually finished jobs in this period
				jobsAssigned: {
					some: {
						finishedAt: { gte: performerStartDate.toDate() },
						// TODO: Chỉ lấy job đã hoàn thành
						// status: { systemType: 'COMPLETED' }
					}
				}
			},
			select: {
				id: true,
				displayName: true,
				email: true,
				avatar: true,
				// Fetch only the relevant completed jobs to count them accurately for this period
				jobsAssigned: {
					where: {
						finishedAt: { gte: performerStartDate.toDate() },
						status: { systemType: 'COMPLETED' }
					},
					select: { incomeCost: true }
				}
			}
		});

		const topPerformers = performers.map(user => {
			const totalIncome = user.jobsAssigned.reduce((sum, job) => sum + job.incomeCost, 0);
			return {
				id: user.id,
				displayName: user.displayName,
				email: user.email,
				avatar: user.avatar,
				totalIncome,
				jobsCount: user.jobsAssigned.length, // This is the "assignee number" for this period
			};
		})
			// CHANGED: Sort by jobsCount descending (Highest number of finished jobs first)
			.sort((a, b) => b.jobsCount - a.jobsCount)
			.slice(0, 5);

		return {
			cards: { activeJobs, overdue: overdueJobs, pendingReview, waitingPayment },
			financialChart: {
				startDate: startDate.toDate(),
				endDate: endDate.toDate(),
				data: financialChart // <--- Returns your desired format
			},
			topPerformers
		};
	}

	/**
	 * Reusable Analytics Engine
	 * Generates time-series data filling in "zero" for empty days/months.
	 */
	async getRevenueAnalytics(
		from?: string,
		to?: string,
		unit: 'day' | 'month' = 'month'
	) {
		const now = dayjs();
		const startDate = from ? dayjs(from).startOf('day') : now.startOf('year');
		const endDate = to ? dayjs(to).endOf('day') : now.endOf('day');

		if (!startDate.isValid() || !endDate.isValid()) throw new Error('Invalid date');

		const jobs = await this.prisma.job.findMany({
			where: {
				finishedAt: {
					gte: startDate.toDate(),
					lte: endDate.toDate(),
				},
				status: { systemType: 'COMPLETED' }
			},
			select: {
				finishedAt: true,
				incomeCost: true,
				staffCost: true,
			},
		});

		const result: any[] = [];
		let iterator = startDate.clone();

		// Align iterator to start of unit (day or month)
		if (unit === 'month') iterator = iterator.startOf('month');
		if (unit === 'day') iterator = iterator.startOf('day');

		const endIterator = endDate;

		// Internal key format for matching
		const formatKey = unit === 'day' ? 'YYYY-MM-DD' : 'YYYY-M';

		// Loop to create "buckets" (even empty ones)
		while (iterator.isSameOrBefore(endIterator, unit)) {
			result.push({
				key: iterator.format(formatKey),
				dateObj: iterator.toDate(), // Save raw date object for easy formatting later
				incomeCost: 0,
				staffCost: 0,
			});
			iterator = iterator.add(1, unit);
		}

		// Fill Buckets
		jobs.forEach((job) => {
			const key = dayjs(job.finishedAt).format(formatKey);
			const bucket = result.find((r) => r.key === key);
			if (bucket) {
				bucket.incomeCost += job.incomeCost || 0;
				bucket.staffCost += job.staffCost || 0;
			}
		});

		return result;
	}

	async userOverview(userId: string, userRole: RoleEnum, from?: string, to?: string, unit: 'day' | 'month' = 'month') {
		const now = dayjs();
		// Determine Current Period
		const startDate = from ? dayjs(from).startOf('day') : now.startOf('month');
		const endDate = to ? dayjs(to).endOf('day') : now.endOf('day');

		if (!startDate.isValid() || !endDate.isValid()) throw new Error('Invalid date');

		// Determine Previous Period (for trend calculation)
		const diff = endDate.diff(startDate, 'day');
		const prevStartDate = startDate.subtract(diff + 1, 'day');
		const prevEndDate = startDate.subtract(1, 'day');

		// --- 1. Fetch Key Metrics (Parallel Execution) ---
		const [
			activeJobsCount,
			completedJobsCount,
			periodRevenue,
			periodHours,
			statusDistribution,
			prevPeriodRevenue, // For trend calc
			rawJobsForGraph
		] = await Promise.all([
			// A. Active Jobs (Jobs currently NOT completed/terminated)
			this.prisma.job.count({
				where: {
					AND: [
						this.buildPermission(userRole, userId),
						{
							status: {
								systemType: { notIn: ['COMPLETED', 'TERMINATED'] }
							}
						}
					]
				}
			}),

			// B. Completed Jobs (In this specific period)
			this.prisma.job.count({
				where: {
					AND: [
						this.buildPermission(userRole, userId),
						{
							status: { systemType: 'COMPLETED' },
							completedAt: {
								gte: startDate.toDate(),
								lte: endDate.toDate(),
							},
						}]
				},
			}),

			// C. Total Earnings (Staff Cost) & Revenue (Income Cost) for Current Period
			this.prisma.job.aggregate({
				_sum: {
					staffCost: true,   // "Earnings" in your chart
					incomeCost: true,  // "Revenue" in your chart
				},
				where: {
					AND: [
						this.buildPermission(userRole, userId),
						{
							finishedAt: {
								gte: startDate.toDate(),
								lte: endDate.toDate(),
							},
						}]
				},
			}),

			// D. Hours Logged (Sum duration from history)
			this.prisma.jobStatusHistory.aggregate({
				_sum: { durationSeconds: true },
				where: {
					changedBy: { id: userId }, // Time logged by this specific user
					createdAt: {
						gte: startDate.toDate(),
						lte: endDate.toDate(),
					},
				},
			}),

			// E. Job Status Distribution (Donut Chart)
			this.prisma.job.groupBy({
				by: ['statusId'],
				_count: { id: true },
				where: {
					assignee: { some: { id: userId } },
					// Usually a status chart shows CURRENT state of all jobs, not just those in period
					// If you want only period specific, add date filters here.
					status: {
						systemType: { notIn: ['TERMINATED'] } // Optional: Hide cancelled jobs
					}
				},
			}),

			// F. Previous Period Earnings (For trend %)
			this.prisma.job.aggregate({
				_sum: { staffCost: true },
				where: {
					AND: [
						this.buildPermission(userRole, userId),
						{
							finishedAt: {
								gte: prevStartDate.toDate(),
								lte: prevEndDate.toDate(),
							},
						}]
				},
			}),

			// G. Fetch Data for Financial Chart (Line Chart)
			this.prisma.job.findMany({
				where: {
					AND: [
						this.buildPermission(userRole, userId),
						{
							finishedAt: {
								gte: startDate.toDate(),
								lte: endDate.toDate(),
							},
						}]
				},
				select: {
					finishedAt: true,
					staffCost: true,
					incomeCost: true,
				},
			}),
		]);

		// --- 2. Process Financial Chart Data ---
		const chartData: any[] = [];
		let iterator = startDate.clone();

		// Align iterator based on unit
		if (unit === 'month') iterator = iterator.startOf('month');
		else iterator = iterator.startOf('day');

		const formatKey = unit === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

		// Create time buckets (filling gaps with 0)
		while (iterator.isSameOrBefore(endDate, unit)) {
			const key = iterator.format(formatKey);
			chartData.push({
				date: key,
				displayDate: unit === 'day' ? iterator.format('MMM DD') : iterator.format('MMM YYYY'),
				earnings: 0, // Staff Cost
				revenue: 0,  // Income Cost
			});
			iterator = iterator.add(1, unit);
		}

		// Fill buckets with actual data
		rawJobsForGraph.forEach((job) => {
			if (!job.finishedAt) return;
			const key = dayjs(job.finishedAt).format(formatKey);
			const bucket = chartData.find((d) => d.date === key);
			if (bucket) {
				bucket.earnings += job.staffCost || 0;
				bucket.revenue += job.incomeCost || 0;
			}
		});

		// --- 3. Process Status Distribution (Donut Chart) ---
		// We need to fetch Status details (names/colors) since groupBy only gives IDs
		const statusIds = statusDistribution.map(s => s.statusId);
		const statuses = await this.prisma.jobStatus.findMany({
			where: { id: { in: statusIds } },
			select: { id: true, displayName: true, hexColor: true, systemType: true }
		});

		const pieChartData = statusDistribution.map(item => {
			const statusInfo = statuses.find(s => s.id === item.statusId);
			return {
				name: statusInfo?.displayName || 'Unknown',
				value: item._count.id,
				color: statusInfo?.hexColor || '#ccc',
				systemType: statusInfo?.systemType
			};
		});

		// --- 4. Calculate Trends ---
		const currentEarnings = periodRevenue._sum.staffCost || 0;
		const previousEarnings = prevPeriodRevenue._sum.staffCost || 0;
		let earningsTrend = 0;

		if (previousEarnings > 0) {
			earningsTrend = ((currentEarnings - previousEarnings) / previousEarnings) * 100;
		} else if (currentEarnings > 0) {
			earningsTrend = 100; // 100% growth if prev was 0
		}

		// --- 5. Return Final DTO ---
		return {
			summary: {
				totalEarnings: currentEarnings,
				earningsTrend: Number(earningsTrend.toFixed(1)),
				jobsCompleted: completedJobsCount,
				hoursLogged: Math.round((periodHours._sum.durationSeconds || 0) / 3600), // Convert seconds to hours
				activeJobs: activeJobsCount,
			},
			charts: {
				financial: chartData,
				jobStatus: pieChartData,
			}
		};
	}

	private buildPermission(
		userRole: RoleEnum,
		userId: string
	): Prisma.JobWhereInput {
		if (userRole === RoleEnum.ADMIN) return {}
		return {
			assignee: { some: { id: userId } },
		}
	}
}