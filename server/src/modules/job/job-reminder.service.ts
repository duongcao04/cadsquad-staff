import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../../providers/prisma/prisma.service'

@Injectable()
export class JobReminderService {
    private readonly logger = new Logger(JobReminderService.name)

    constructor(private prisma: PrismaService) {}

    // Chạy vào lúc 8:00 sáng mỗi ngày
    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async handleDeadlineReminders() {
        this.logger.log('Checking for jobs due in the next 7 days...')

        const now = new Date()
        const sevenDaysFromNow = new Date()
        sevenDaysFromNow.setDate(now.getDate() + 7)

        // 1. Tìm các Job sắp đến hạn nhưng chưa hoàn thành
        const upcomingJobs = await this.prisma.job.findMany({
            where: {
                dueAt: {
                    gt: now, // Lớn hơn hiện tại
                    lte: sevenDaysFromNow, // Nhỏ hơn hoặc bằng 7 ngày tới
                },
                completedAt: null, // Chưa hoàn thành
                deletedAt: null, // Chưa bị xóa
            },
            include: {
                assignments: true, // Để lấy danh sách nhân viên được giao việc
            },
        })

        if (upcomingJobs.length === 0) {
            this.logger.log('No upcoming deadlines found.')
            return
        }

        // 2. Tạo thông báo cho từng Job
        for (const job of upcomingJobs) {
            const daysLeft = Math.ceil(
                (job.dueAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )

            // Tạo thông báo cho tất cả assignees
            const notificationPromises = job.assignments.map((assignment) => {
                return this.prisma.notification.create({
                    data: {
                        userId: assignment.userId,
                        title: `Sắp đến hạn: ${job.no}`,
                        content: `Công việc "${job.displayName}" sẽ đến hạn sau ${daysLeft} ngày (${job.dueAt.toLocaleDateString()}).`,
                        type: 'DEADLINE_REMINDER',
                        redirectUrl: `/jobs/${job.id}`,
                    },
                })
            })

            await Promise.all(notificationPromises)
            this.logger.debug(`Reminders sent for Job: ${job.no}`)
        }

        this.logger.log(`Processed reminders for ${upcomingJobs.length} jobs.`)
    }
}
