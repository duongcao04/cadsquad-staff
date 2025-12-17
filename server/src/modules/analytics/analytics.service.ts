import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
	constructor(private prisma: PrismaService) { }

	async getRevenueAnalytics(from?: string, to?: string) {
		// 1. Parse Dates or Set Defaults (Default: Jan 1st of current year to Now)
		const now = new Date();
		const startDate = from ? new Date(from) : new Date(now.getFullYear(), 0, 1);
		const endDate = to ? new Date(to) : new Date(); // Defaults to now if 'to' is missing

		// Ensure strictly valid dates
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			throw new Error('Invalid date format provided');
		}

		// 2. Fetch Data from Prisma
		const jobs = await this.prisma.job.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				// Optional: Filter only completed jobs to be accurate about "Revenue"
				// status: { systemType: JobStatusSystemType.COMPLETED },
			},
			select: {
				createdAt: true,
				incomeCost: true,
				staffCost: true,
			},
		});

		// 3. Generate "Buckets" for every month in the range
		// This ensures that if no sales happened in "March", it still returns { month: "March", income: 0 }
		const result: {
			key: string, // internal helper key
			month: string, // The display label you requested
			incomeCost: number,
			staffCost: number,
			year: number, // Optional: useful for frontend if range spans years
		}[] = [];
		const iterator = new Date(startDate);
		iterator.setDate(1); // Start from the 1st of the month to avoid skipping issues

		const monthNames = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		while (iterator <= endDate || (iterator.getMonth() === endDate.getMonth() && iterator.getFullYear() === endDate.getFullYear())) {
			const monthIndex = iterator.getMonth();
			const year = iterator.getFullYear();

			// Create a unique key for grouping (Year-Month) to handle multi-year ranges correctly
			const key = `${year}-${monthIndex}`;

			result.push({
				key, // internal helper key
				month: monthNames[monthIndex], // The display label you requested
				incomeCost: 0,
				staffCost: 0,
				year: year, // Optional: useful for frontend if range spans years
			});

			// Move to next month
			iterator.setMonth(iterator.getMonth() + 1);
		}

		// 4. Fill the Buckets with Data
		jobs.forEach((job) => {
			const jobDate = new Date(job.createdAt);
			const key = `${jobDate.getFullYear()}-${jobDate.getMonth()}`;

			const bucket = result.find((r) => r.key === key);
			if (bucket) {
				bucket.incomeCost += job.incomeCost || 0;
				bucket.staffCost += job.staffCost || 0;
			}
		});

		// 5. Clean up helper keys before returning
		return result.map(({ key, year, ...rest }) => rest);
	}
}