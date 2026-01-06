import { forwardRef, Module } from '@nestjs/common'
import { MailModule } from '../../providers/mail/mail.module'
import { AuthModule } from '../auth/auth.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserSecurityService } from './user-security.service'

@Module({
    imports: [forwardRef(() => AuthModule), MailModule],
    controllers: [UserController],
    providers: [UserService, UserSecurityService],
    exports: [UserService, UserSecurityService],
})
export class UserModule {}
