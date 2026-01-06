import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AblyModule } from './modules/ably/ably.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { AuthModule } from './modules/auth/auth.module'
import { BrowserSubscribesModule } from './modules/browser-subscribes/browser-subscribes.module'
import { ClientModule } from './modules/client/client.module'
import { CommunityModule } from './modules/community/community.module'
import { DepartmentModule } from './modules/department/department.module'
import { ExcelModule } from './modules/excel/excel.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { HealthModule } from './modules/health/health.module'
import { JobStatusModule } from './modules/job-status/job-status.module'
import { JobTitleModule } from './modules/job-title/job-title.module'
import { JobTypeModule } from './modules/job-type/job-type.module'
import { JobModule } from './modules/job/job.module'
import { NotificationModule } from './modules/notification/notification.module'
import { PaymentChannelModule } from './modules/payment-channel/payment-channel.module'
import { RoleModule } from './modules/role-permissions/role.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserDevicesModule } from './modules/user-devices/user-devices.module'
import { UserModule } from './modules/user/user.module'
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module'
import { MailModule } from './providers/mail/mail.module'
import { PrismaModule } from './providers/prisma/prisma.module'
import { RedisModule } from './providers/redis/redis.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PrismaModule,
        RedisModule,
        MailModule,
        CloudinaryModule,
        AblyModule,
        RoleModule,
        AuthModule,
        UserModule,
        UserDevicesModule,
        JobModule,
        JobTypeModule,
        JobStatusModule,
        PaymentChannelModule,
        NotificationModule,
        DepartmentModule,
        JobTitleModule,
        GalleryModule,
        BrowserSubscribesModule,
        UploadModule,
        HealthModule,
        ExcelModule,
        AnalyticsModule,
        CommunityModule,
        ClientModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
