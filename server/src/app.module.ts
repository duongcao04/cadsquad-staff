import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './providers/prisma/prisma.module'
import { JobModule } from './modules/job/job.module'
import { JobTypeModule } from './modules/job-type/job-type.module'
import { JobStatusModule } from './modules/job-status/job-status.module'
import { PaymentChannelModule } from './modules/payment-channel/payment-channel.module'
import { NotificationModule } from './modules/notification/notification.module'

@Module({
  imports: [PrismaModule, UserModule, AuthModule, JobModule, JobTypeModule, JobStatusModule, PaymentChannelModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
