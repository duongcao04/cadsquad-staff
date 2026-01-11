import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { join } from 'path'
import { MailService } from './mail.service'
import { EmailController } from './email.controller'
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: process.env.MAIL_HOST,
					auth: {
						user: process.env.MAIL_USER,
						pass: process.env.MAIL_PASS,
					},
				},
				defaults: {
					from: `"No Reply" <${process.env.MAIL_FROM}>`, // Good practice to set a default sender
				},
				template: {
					dir: join(process.cwd(), 'templates'),
					adapter: new HandlebarsAdapter({
						// Định nghĩa các logic so sánh cho template .hbs
						eq: (a: any, b: any) => a === b,
					}),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	controllers: [EmailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
