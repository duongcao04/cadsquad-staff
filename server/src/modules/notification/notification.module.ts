import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { NotificationController } from './notification.controller'
import { NotificationGateway } from './notification.gateway'
import { NotificationService } from './notification.service'
import { FirebaseModule } from '../../providers/firebase/firebase.module'

@Module({
    imports: [AuthModule, FirebaseModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
