import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { RoleEnum, User } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { UserResponseDto } from './dto/user-response.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { removeVietnameseAccent } from '../../utils/removeVietnameseAccent'
import { BcryptService } from '../auth/bcrypt.service'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly bcryptService: BcryptService) { }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const { jobTitleId, departmentId, ...rest } = data
    const username = data.username ? data.username :
      removeVietnameseAccent(data.displayName.toLowerCase()) +
      Date.now()

    if (await this.existingEmail(data.email) || await this.existingUsername(username)) {
      throw new ConflictException("User already exists")
    }

    const password = data.password ? await this.bcryptService.hash(data.password) : ''
    const avatar = data.avatar ? data.avatar : `https://ui-avatars.com/api/?name=${data.displayName.replaceAll(" ", "+")}&background=random`

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...rest,
          password,
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
      console.log(error);
      throw new BadRequestException(error.message)
    }
  }

  async existingEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email
      }
    })
  }

  async existingUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username
      }
    })
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<{ message: string }> {
    const { oldPassword, newPassword, newConfirmPassword } = dto

    // check user tồn tại
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // check old password
    const isMatch = await this.bcryptService.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect')
    }

    // check new === confirm
    if (newPassword !== newConfirmPassword) {
      throw new BadRequestException('New password and confirm password do not match')
    }

    // check new khác old
    const isSameAsOld = await this.bcryptService.compare(newPassword, user.password)
    if (isSameAsOld) {
      throw new BadRequestException('New password must be different from old password')
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
        isValid: 0
      }
    }
    const existingUsername = await this.prismaService.user.findUnique({
      where: {
        username
      }
    })
    return {
      isValid: Boolean(existingUsername) ? 0 : 1
    }
  }

  async getUserRole(userId: string): Promise<RoleEnum> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user.role
  }
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        department: {},
        jobTitle: {}
      },
      orderBy: {
        displayName: 'asc'
      }
    })
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    })
  }

  async resetPassword(userId: string, data: ResetPasswordDto) {
    const hashedPassword = await this.bcryptService.hash(data.newPassword)
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    return { username: user.username }
  }

  /**
   * Find a user by their unique ID.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<User | null>} The user object retrieved from the database, or null if not found.
   *
   * @throws {NotFoundException} If no user is found with the provided ID.
   */
  async findById(userId: string): Promise<User | null> {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id: userId }
      })
      const userRes = plainToInstance(UserResponseDto, userData, {
        excludeExtraneousValues: true,
      })
      return userRes as unknown as User
    } catch (error) {
      throw new NotFoundException('User not found')
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    })
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async delete(id: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new NotFoundException("User not found")
    }

    await this.prismaService.user.delete({
      where: { id },
    })

    return {
      username: existingUser.username
    }
  }
}
