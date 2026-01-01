import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    /**
     * Thông báo cho nhân sự khi được giao Job mới
     */
    async sendJobAssignmentNotification(
        user: User,
        jobNo: string,
        jobTitle: string
    ) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: `[CAD SQUAD] Bạn có nhiệm vụ mới: ${jobNo}`,
            template: './job-assignment', // tên file job-assignment.hbs
            context: {
                name: user.displayName,
                jobNo,
                jobTitle,
                url: `${process.env.FRONTEND_URL}/jobs/${jobNo}`,
            },
        })
    }

    async sendAccountStatusUpdate(
        user: Pick<User, 'email' | 'displayName' | 'isActive'>
    ) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: `[CAD SQUAD] Cập nhật trạng thái tài khoản: ${user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}`,
            template: './account-status',
            context: {
                name: user.displayName,
                status: user.isActive ? 'Active' : 'Inactive', // Key để matching với logic trong .hbs
            },
        })
    }
}
