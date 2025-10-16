import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { NotificationResponseDto } from './dto/notification-response.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({ data })
    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    })
  }

  async findAll(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        userId
      }
    })
    return plainToInstance(NotificationResponseDto, notifications, {
      excludeExtraneousValues: true,
    })
  }

  async findById(id: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })
    if (!notification) throw new NotFoundException('Notification not found')
    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    })
  }

  async update(
    id: string,
    data: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data,
    })
    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    })
  }

  async delete(id: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.delete({
      where: { id },
    })
    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    })
  }
}
