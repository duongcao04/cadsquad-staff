import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { LoginUserDto } from './dto/login-user.dto'
import { BcryptService } from './bcrypt.service'
import { TokenService } from './token.service'
import { UserResponseDto } from '../user/dto/user-response.dto'
import { plainToInstance } from 'class-transformer'

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
      avatar: "",
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
      throw new UnauthorizedException('Incorrect email or password')
    }
    // 2. Compare inputPassword and databasePassword
    const isCertificate = await this.bcryptService.compare(loginDto.password, existingUser.password)
    if (!isCertificate) {
      throw new UnauthorizedException('Incorrect email or password')
    }

    // 3. Return token
    try {
      const accessToken = await this.tokenService.getAccessToken(existingUser)

      // Update last logged in timestamp
      await this.updateLastLoggedIn(existingUser.id);

      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException('Incorrect email or password', {
        description: error,
      })
    }
  }

  private async updateLastLoggedIn(userId: string) {
    try {
      const updatedUser = await this.prismaService.$executeRaw`
      UPDATE "User"
      SET "lastLoginAt" = NOW()
      WHERE "id" = ${userId};
    `;
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update last logined time: ${error.message}`);
    }
  }

  /**
     * Get user profile from token payload id
     *
     * @param {number} userId - The ID of the user to retrieve.
     * @returns {Promise<User | null>} The user object retrieved from the database, or null if not found.
     *
     * @throws {NotFoundException} If no user is found with the provided ID.
     */
  async getProfile(userId: string): Promise<User | null> {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          department: true,
          jobTitle: true
        }
      })
      const userRes = plainToInstance(UserResponseDto, userData, {
        excludeExtraneousValues: true,
      })
      return userRes as unknown as User
    } catch (error) {
      throw new NotFoundException('User not found')
    }
  }
}
