import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { LoginUserDto } from './dto/login-user.dto'
import { BcryptService } from './bcrypt.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
    private tokenService: TokenService,
  ) { }

  async register(registerDto: RegisterUserDto) {
    // 1. Check user existing
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    })
    if (existingUser) {
      throw new ConflictException('User already existing')
    }
    // 2. Sync new user with model
    // - Generate username
    const username =
      registerDto.firstName.toLowerCase().replace(/\s+/g, '_') +
      registerDto.lastName.toLowerCase().replace(/\s+/g, '_') +
      Date.now()
    // - Hash password
    const password = await this.bcryptService.hash(registerDto.password)
    // - Sync
    const newUser: Prisma.UserCreateInput = {
      ...registerDto,
      displayName: registerDto.firstName + ' ' + registerDto.lastName,
      password,
      username,
    }
    // 3. Create user
    try {
      // - Prisma -> create
      const createdUser = await this.prismaService.user.create({
        data: newUser,
      })
      // - Sign Access token
      const accessToken = await this.tokenService.getAccessToken(createdUser)
      return { accessToken }
    } catch (error) {
      throw new InternalServerErrorException('Register failed', {
        description: error,
      })
    }
  }

  async login(loginDto: LoginUserDto) {
    // 1. Check user existing
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    })
    if (!existingUser) {
      throw new NotFoundException('Incorrect email or password')
    }
    // 2. Compare inputPassword and databasePassword
    const isCertificate = await this.bcryptService.compare(loginDto.password, existingUser.password)
    if (!isCertificate) {
      throw new NotFoundException('Incorrect email or password')
    }

    // 3. Return token
    try {
      const accessToken = await this.tokenService.getAccessToken(existingUser)
      return { accessToken }
    } catch (error) {
      throw new InternalServerErrorException('Incorrect email or password', {
        description: error,
      })
    }
  }
}
