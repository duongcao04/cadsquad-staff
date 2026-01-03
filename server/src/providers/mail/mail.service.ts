import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    constructor(private mailerService: MailerService) {}

    /**
     * Thông báo cho nhân sự khi được giao Job mới
     */
    async sendJobAssignmentNotification(
        user: User,
        jobNo: string,
        jobTitle: string
    ) {
        try {
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
            this.logger.log(`Invitation email sent to: ${user.email}`)
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${user.email}: ${error.message}`
            )
        }
    }

    async sendAccountStatusUpdate(
        user: Pick<User, 'email' | 'displayName' | 'isActive'>
    ) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: `[CAD SQUAD] Cập nhật trạng thái tài khoản: ${user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}`,
                template: './account-status',
                context: {
                    name: user.displayName,
                    status: user.isActive ? 'Active' : 'Inactive', // Key để matching với logic trong .hbs
                },
            })
            this.logger.log(`Invitation email sent to: ${user.email}`)
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${user.email}: ${error.message}`
            )
        }
    }

    async sendUserInvitation(
        email: string,
        displayName: string,
        password: string
    ) {
        const loginUrl = `${process.env.CLIENT_URL}/login`

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: '🚀 Welcome to CAD SQUAD - Your Account is Ready',
                template: './user-invitation',
                context: {
                    displayName,
                    email,
                    password,
                    loginUrl,
                },
            })
            this.logger.log(`Invitation email sent to: ${email}`)
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${email}: ${error.message}`
            )
        }
    }
}
