import { Module } from '@nestjs/common'
import { JobService } from './job.service'
import { JobController } from './job.controller'
import { AuthModule } from '../auth/auth.module'
import { ActivityLogService } from './activity-log.service'
import { UserModule } from '../user/user.module'
import { UserConfigModule } from '../user-config/user-config.module'
import { NotificationModule } from '../notification/notification.module'
import { JobTypeModule } from '../job-type/job-type.module'

@Module({
    imports: [
        AuthModule,
        UserModule,
        UserConfigModule,
        NotificationModule,
        JobTypeModule,
    ],
    controllers: [JobController],
    providers: [JobService, ActivityLogService],
    exports: [JobService, ActivityLogService],
})
export class JobModule {}
