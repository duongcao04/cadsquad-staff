import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '../../generated/prisma'

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
            this.logger.log(`Send job assignment to: ${user.email}`)
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
                from: this.getEmailFrom(),
                context: {
                    name: user.displayName,
                    status: user.isActive ? 'Active' : 'Inactive', // Key để matching với logic trong .hbs
                },
            })
            this.logger.log(`Send active account email to: ${user.email}`)
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${user.email}: ${error.message}`
            )
        }
    }

    async sendResetPasswordEmail(
        email: string,
        token: string,
        user: { displayName: string }
    ) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `[CAD SQUAD] Reset your password`,
                template: './reset-password-email',
                from: this.getEmailFrom(),
                context: {
                    name: user.displayName || 'User',
                    link: `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`,
                },
            })
            this.logger.log(`Send email request password to: ${email}`)
        } catch (error) {
            this.logger.error(
                `Failed to send email request password to ${email}: ${error.message}`
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
                from: this.getEmailFrom(),
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

    /**
     * Generic method to send emails with CC, BCC, and Attachments
     */
    async sendEmail(options: {
        to: string | string[]
        subject: string
        content: string
        fromName?: string // e.g., "John from CAD SQUAD"
        fromEmail?: string // e.g, "support@cadsquad.vn"
        cc?: string | string[]
        bcc?: string | string[]
        attachments?: Array<{
            filename: string
            path?: string
            content?: any
            contentType?: string
        }>
    }) {
        const {
            to,
            subject,
            content,
            fromName,
            fromEmail,
            cc,
            bcc,
            attachments,
        } = options
        // Construct the 'from' string: "Name <email@example.com>"
        const customFrom = fromName
            ? `${fromName} <${fromEmail || process.env.MAIL_USER}>`
            : 'CADSQUAD <noreply@cadsquad.vn>'

        try {
            const mailOptions: ISendMailOptions = {
                to,
                cc,
                bcc,
                from: customFrom,
                subject,
                html: content,
                attachments, // Array of { filename, path/content }
            }

            await this.mailerService.sendMail(mailOptions)

            this.logger.log(
                `Email successfully sent to: ${Array.isArray(to) ? to.join(', ') : to}`
            )
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${to}: ${error.message}`,
                error.stack
            )
            throw error // Re-throw if you want the calling service to handle the error
        }
    }

    private getEmailFrom = (fromName?: string, fromEmail?: string) => {
        return fromName
            ? `${fromName} <${fromEmail || process.env.MAIL_USER}>`
            : 'CADSQUAD <noreply@cadsquad.vn>'
    }
}
