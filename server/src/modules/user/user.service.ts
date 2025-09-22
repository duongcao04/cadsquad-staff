import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { User } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { UserResponseDto } from './dto/user-response.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const { jobTitleIds, departmentId, ...rest } = data

    const user = await this.prismaService.user.create({
      data: {
        ...rest,
        ...(jobTitleIds && jobTitleIds.length > 0
          ? {
            jobTitles: {
              connect: jobTitleIds.map((id) => ({ id })),
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
        jobTitles: true,
        department: true,
      },
    })

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany()
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    })
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

  async delete(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.delete({
      where: { id },
    })
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    })
  }
}
