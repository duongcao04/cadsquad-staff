import { forwardRef, Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { RedisModule } from '../../providers/redis/redis.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { BcryptService } from './bcrypt.service'
import { AzureStrategy } from './core/azure.strategy'
import { JwtGuard } from './jwt.guard'
import { SessionService } from './session.service'
import { TokenService } from './token.service'
import { WsJwtGuard } from './ws-jwt.guard'

@Global()
@Module({
    imports: [
        RedisModule,
        forwardRef(() => UserModule),
        JwtModule.register({
            global: true,
            secret: String(process.env.JWT_SECRET_KEY),
            signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_AT) },
        }),
        PassportModule.register({ defaultStrategy: 'azure-ad' }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        BcryptService,
        TokenService,
        AzureStrategy,
        JwtGuard,
        WsJwtGuard,
        SessionService,
    ],
    exports: [
        AuthService,
        BcryptService,
        TokenService,
        JwtGuard,
        WsJwtGuard,
        SessionService,
    ],
})
export class AuthModule {}
