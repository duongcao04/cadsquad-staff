import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { plainToInstance } from 'class-transformer'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { NotificationResponseDto } from './dto/notification-response.dto'
import { GatewayService } from '../gateway/gateway.service'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)
  constructor(private readonly prisma: PrismaService, private readonly gatewayService: GatewayService) { }

  async create(data: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({ data })

    const event = 'notification' // choose event name
    const sent = await this.gatewayService.emitToUser(data.userId, event, data)
    if (sent) {
      this.logger.log(`Sent notification to user ${data.userId}`)
    } else {
      this.logger.log(`User ${data.userId} is offline — saved for later if needed`)
      // optional: persist notification to DB so client gets it when reconnects
    }

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
