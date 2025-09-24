import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { AuthModule } from '../auth/auth.module';
import { ActivityLogService } from './activity-log.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule],
  controllers: [JobController],
  providers: [JobService, ActivityLogService],
  exports: [JobService, ActivityLogService],
})
export class JobModule { }
