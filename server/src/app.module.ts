import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { CommentModule } from './modules/comment/comment.module'
import { DepartmentModule } from './modules/department/department.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { JobStatusModule } from './modules/job-status/job-status.module'
import { JobTitleModule } from './modules/job-title/job-title.module'
import { JobTypeModule } from './modules/job-type/job-type.module'
import { JobModule } from './modules/job/job.module'
import { NotificationModule } from './modules/notification/notification.module'
import { PaymentChannelModule } from './modules/payment-channel/payment-channel.module'
import { UserDevicesModule } from './modules/user-devices/user-devices.module'
import { UserModule } from './modules/user/user.module'
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module'
import { PrismaModule } from './providers/prisma/prisma.module'
import { BrowserSubscribesModule } from './modules/browser-subscribes/browser-subscribes.module'

@Module({
  imports: [PrismaModule, CloudinaryModule, UserModule, AuthModule, JobModule, JobTypeModule, JobStatusModule, PaymentChannelModule, NotificationModule, CommentModule, DepartmentModule, JobTitleModule, GalleryModule, UserDevicesModule, BrowserSubscribesModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule { }
