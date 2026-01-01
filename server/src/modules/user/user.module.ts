import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'
import { MailService } from '../mail/mail.service'
import { MailModule } from '../mail/mail.module'

@Module({
    imports: [forwardRef(() => AuthModule), MailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
