import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { JobActivityLog } from '@prisma/client'
import { CreateActivityLogDto } from './dto/create-activity-log.dto'

@Injectable()
export class ActivityLogService {
	constructor(private readonly prisma: PrismaService) { }

	/**
	 * Get all activity logs for a job.
	 * @param jobId The job's ID.
	 */
	async findByJobId(jobId: string): Promise<JobActivityLog[]> {
		const result = await this.prisma.jobActivityLog.findMany({
			where: { jobId },
			orderBy: {
				modifiedAt: 'desc',
			},
		})

		if (!result || result.length === 0) {
			throw new NotFoundException('No activity logs found for this job.')
		}

		return result
	}

	/**
	 * Find a single activity log by its ID.
	 */
	async findOne(id: string): Promise<JobActivityLog> {
		const log = await this.prisma.jobActivityLog.findUnique({
			where: { id },
			include: {
				modifiedBy: true,
				job: true,
			},
		})

		if (!log) throw new NotFoundException('Activity log not found.')
		return log
	}

	/**
	 * Create a new activity log.
	 */
	async create(data: CreateActivityLogDto): Promise<JobActivityLog> {
		return this.prisma.jobActivityLog.create({ data })
	}

	/**
	 * Delete an activity log by ID.
	 */
	async remove(id: string): Promise<JobActivityLog> {
		return this.prisma.jobActivityLog.delete({ where: { id } })
	}
}
