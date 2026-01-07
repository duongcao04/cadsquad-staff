import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { Prisma, SecurityLogStatus, User } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { UserResponseDto } from '../user/dto/user-response.dto'
import { BcryptService } from './bcrypt.service'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { TokenService } from './token.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UserSecurityService } from '../user/user-security.service'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bcryptService: BcryptService,
        @Inject(forwardRef(() => TokenService))
        private readonly tokenService: TokenService,
        private readonly userSecurityService: UserSecurityService,
        private sessionService: SessionService
    ) {}

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
            avatar: '',
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
            const accessToken =
                await this.tokenService.getAccessToken(createdUser)
            return { accessToken }
        } catch (error) {
            throw new InternalServerErrorException('Register failed', {
                description: error,
            })
        }
    }

    async login(ip: string, userAgent: string, loginDto: LoginUserDto) {
        // 1. Check user existing
        const existingUser = await this.prismaService.user.findUnique({
            where: { email: loginDto.email },
        })
        if (!existingUser) {
            // Save User Security Log
            throw new UnauthorizedException('Incorrect email or password')
        }
        // 2. Compare inputPassword and databasePassword
        const isCertificate = await this.bcryptService.compare(
            loginDto.password,
            existingUser.password
        )
        if (!isCertificate) {
            await this.userSecurityService.createLog({
                userId: existingUser.id,
                event: 'Login Failed',
                status: SecurityLogStatus.FAILED,
                ipAddress: ip,
                userAgent,
            })
            throw new UnauthorizedException('Incorrect email or password')
        }

        // Save User Security Log
        await this.userSecurityService.createLog({
            userId: existingUser.id,
            event: 'Login Success',
            status: SecurityLogStatus.SUCCESS,
            ipAddress: ip,
            userAgent,
        })
        // 4. Return token
        try {
            const accessToken =
                await this.tokenService.getAccessToken(existingUser)

            // 3. Lưu Session vào Redis
            const sessionId = await this.sessionService.saveSession(
                existingUser.id,
                {
                    userId: existingUser.id,
                    accessToken: {
                        expiresAt: accessToken.expiresAt,
                        token: accessToken.token ?? '',
                    }, // Lưu token để có thể thu hồi (revoke)
                    ipAddress: ip,
                    device: userAgent,
                    lastActive: new Date().toISOString(),
                }
            )
            // Update last logged in timestamp
            await this.updateLastLoggedIn(existingUser.id)

            return { accessToken, sessionId, user: existingUser }
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
    `
            return updatedUser
        } catch (error) {
            throw new Error(
                `Failed to update last logined time: ${error.message}`
            )
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
                    jobTitle: true,
                    role: {
                        include: {
                            permissions: true,
                        },
                    },
                    securityLogs: true,
                },
            })
            const userRes = plainToInstance(UserResponseDto, userData, {
                excludeExtraneousValues: true,
            })
            return userRes as unknown as User
        } catch (error) {
            throw new NotFoundException('User not found')
        }
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        return await this.prismaService.user.update({
            where: { id: userId },
            data: {
                displayName: data.displayName,
                avatar: data.avatar,
                phoneNumber: data.phoneNumber,
            },
            include: {
                role: {
                    include: { permissions: true },
                },
                department: true,
                jobTitle: true,
            },
        })
    }
    async getEffectivePermissions(userId: string) {
        // 1. Lấy User + Role + UserOverride
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: { permissions: true }, // Lấy quyền gốc từ Role
                },
                userPermissions: {
                    include: { permission: true }, // Lấy quyền riêng
                },
            },
        })

        if (!user) return []

        // 2. Tách quyền riêng thành 2 nhóm: Grant và Deny
        const grantedOverrides = user.userPermissions
            .filter((up) => !up.isDenied)
            .map((up) => up.permission.entityAction) // ['job.read']

        const deniedOverrides = user.userPermissions
            .filter((up) => up.isDenied)
            .map((up) => up.permission.entityAction) // ['user.delete']

        // 3. Lấy danh sách quyền từ Role (dạng string code)
        const rolePermissions =
            user.role?.permissions.map((p) => p.entityAction) || []

        // 4. Gộp quyền (Role + Grant)
        const allAllowed = new Set([...rolePermissions, ...grantedOverrides])

        // 5. Trừ đi quyền bị cấm (Exclude)
        deniedOverrides.forEach((deniedCode) => {
            allAllowed.delete(deniedCode)
        })

        // Trả về mảng quyền cuối cùng
        return Array.from(allAllowed)
    }
}
