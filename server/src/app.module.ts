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
import { ConfigModule } from './modules/config/config.module'
import { CommentModule } from './modules/comment/comment.module'
import { DepartmentModule } from './modules/department/department.module'
import { JobTitleModule } from './modules/job-title/job-title.module'
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module'
import { GalleryModule } from './modules/gallery/gallery.module';
import { GatewayModule } from './modules/gateway/gateway.module'

@Module({
  imports: [PrismaModule, GatewayModule, CloudinaryModule, UserModule, AuthModule, JobModule, JobTypeModule, JobStatusModule, PaymentChannelModule, NotificationModule, ConfigModule, CommentModule, DepartmentModule, JobTitleModule, GalleryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
