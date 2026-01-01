import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { RoleEnum, User } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { removeVietnameseAccent } from '../../utils/removeVietnameseAccent'
import { BcryptService } from '../auth/bcrypt.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { MailService } from '../mail/mail.service'

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bcryptService: BcryptService,
        private readonly mailService: MailService
    ) {}

    async create(data: CreateUserDto): Promise<UserResponseDto> {
        const { jobTitleId, departmentId, ...rest } = data
        const username = data.username
            ? data.username
            : removeVietnameseAccent(data.displayName.toLowerCase()) +
              Date.now()

        if (
            (await this.existingEmail(data.email)) ||
            (await this.existingUsername(username))
        ) {
            throw new ConflictException('User already exists')
        }

        const password = data.password
            ? await this.bcryptService.hash(data.password)
            : ''
        const avatar = data.avatar
            ? data.avatar
            : `https://ui-avatars.com/api/?name=${data.displayName.replaceAll(' ', '+')}&background=random`

        try {
            const user = await this.prismaService.user.create({
                data: {
                    ...rest,
                    password,
                    displayName: data.displayName,
                    avatar,
                    username,
                    ...(jobTitleId
                        ? {
                              jobTitle: {
                                  connect: { id: jobTitleId },
                              },
                          }
                        : {}),
                    ...(departmentId
                        ? {
                              department: {
                                  connect: { id: departmentId },
                              },
                          }
                        : {}),
                },
                include: {
                    jobTitle: true,
                    department: true,
                },
            })

            return plainToInstance(UserResponseDto, user, {
                excludeExtraneousValues: true,
            })
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }
    }

    async updatePassword(
        userId: string,
        dto: UpdatePasswordDto
    ): Promise<{ message: string }> {
        const { oldPassword, newPassword, newConfirmPassword } = dto

        // check user tồn tại
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        // check old password
        const isMatch = await this.bcryptService.compare(
            oldPassword,
            user.password
        )
        if (!isMatch) {
            throw new BadRequestException('Old password is incorrect')
        }

        // check new === confirm
        if (newPassword !== newConfirmPassword) {
            throw new BadRequestException(
                'New password and confirm password do not match'
            )
        }

        // check new khác old
        const isSameAsOld = await this.bcryptService.compare(
            newPassword,
            user.password
        )
        if (isSameAsOld) {
            throw new BadRequestException(
                'New password must be different from old password'
            )
        }

        // hash và update
        const hashedPassword = await this.bcryptService.hash(newPassword)
        await this.prismaService.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        })

        return { message: 'Password updated successfully' }
    }

    async checkUsernameValid(username: string) {
        if (
            username.toLocaleLowerCase() === 'admin' ||
            username.toLocaleLowerCase() === 'cadsquadadmin' ||
            username.toLocaleLowerCase() === 'admin-cadsquad' ||
            username.toLocaleLowerCase() === 'cadsquad-admin'
        ) {
            return {
                isValid: 0,
            }
        }
        const existingUsername = await this.prismaService.user.findUnique({
            where: {
                username,
            },
        })
        return {
            isValid: Boolean(existingUsername) ? 0 : 1,
        }
    }

    async getUserRole(userId: string): Promise<RoleEnum> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user.role
    }
    async findAll(): Promise<{ users: UserResponseDto[]; total: number }> {
        const [users, total] = await this.prismaService.$transaction([
            // 1. Fetch Users
            this.prismaService.user.findMany({
                include: {
                    department: true, // simplified from {}
                    jobTitle: true,
                },
                orderBy: {
                    role: 'desc',
                },
            }),

            // 2. Count Total
            this.prismaService.user.count(),
        ])

        return {
            users: plainToInstance(UserResponseDto, users, {
                excludeExtraneousValues: true,
            }),
            total,
        }
    }

    async resetPassword(userId: string, data: ResetPasswordDto) {
        const hashedPassword = await this.bcryptService.hash(data.newPassword)
        const user = await this.prismaService.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        })
        return { username: user.username }
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const userData = await this.prismaService.user.findUnique({
                where: { id: userId },
            })
            const userRes = plainToInstance(UserResponseDto, userData, {
                excludeExtraneousValues: true,
            })
            return userRes as unknown as User
        } catch (error) {
            throw new NotFoundException('User not found')
        }
    }
    /**
     * Find a user by their unique ID.
     *
     * @param {number} username - The ID of the user to retrieve.
     * @returns {Promise<User | null>} The user object retrieved from the database, or null if not found.
     *
     * @throws {NotFoundException} If no user is found with the provided ID.
     */
    async findByUsername(username: string): Promise<User | null> {
        try {
            const userData = await this.prismaService.user.findUnique({
                where: { username: username },
                include: {
                    department: true,
                    jobTitle: true,
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

    async update(
        username: string,
        data: UpdateUserDto
    ): Promise<{ id: string; username: string }> {
        const user = await this.prismaService.user.update({
            where: { username },
            data,
        })
        return { id: user.id, username: user.username }
    }

    async delete(id: string) {
        const existingUser = await this.prismaService.user.findUnique({
            where: { id },
        })

        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        await this.prismaService.user.delete({
            where: { id },
        })

        return {
            username: existingUser.username,
        }
    }

    async toggleUserStatus(
        modifierId: string,
        userId: string,
        forceStatus?: string
    ) {
        // 1. Kiểm tra user tồn tại
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isActive: true,
                role: true,
                displayName: true,
                email: true,
            },
        })

        if (!user) throw new NotFoundException('User not found')

        // 2. Bảo mật: Không cho phép Admin tự vô hiệu hóa chính mình
        if (userId === modifierId) {
            throw new ForbiddenException(
                'You cannot deactivate your own account'
            )
        }

        // 3. Xác định trạng thái mới
        // Nếu forceStatus là '0' -> false, '1' -> true. Nếu undefined -> đảo ngược (!user.isActive)
        let newStatus: boolean
        if (forceStatus !== undefined) {
            newStatus = forceStatus === '1'
        } else {
            newStatus = !user.isActive
        }

        if (!newStatus) {
            await this.mailService.sendAccountStatusUpdate({
                displayName: user.displayName,
                email: user.email,
                isActive: user.isActive,
            })
        }

        const resultUpdated = await this.prismaService.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
        })
        // 3. Cập nhật trạng thái
        return {
            isActive: resultUpdated.isActive,
            username: resultUpdated.username,
        }
    }

    private async existingEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email,
            },
        })
    }

    private async existingUsername(username: string) {
        return await this.prismaService.user.findUnique({
            where: {
                username,
            },
        })
    }
}
