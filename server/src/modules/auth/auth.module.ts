import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { BcryptService } from './bcrypt.service';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AzureStrategy } from './core/azure.strategy';

@Global()
@Module({
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: String(process.env.JWT_SECRET_KEY),
    signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_AT) },
  }), PassportModule.register({ defaultStrategy: 'azure-ad' }),],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, BcryptService, TokenService, AzureStrategy],
  exports: [AuthService, PrismaService, BcryptService, TokenService],
})
export class AuthModule { }
