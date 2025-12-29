import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { NotificationResponseDto } from './dto/notification-response.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { NotificationStatus, NotificationType } from '@prisma/client'
import { AblyService } from '../ably/ably.service'

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly ablyService: AblyService
    ) {}

    async create(
        data: CreateNotificationDto
    ): Promise<NotificationResponseDto> {
        const notification = await this.prisma.notification.create({ data })
        return plainToInstance(NotificationResponseDto, notification, {
            excludeExtraneousValues: true,
        })
    }

    /**
     * Send a single notification and publish to Ably
     */
    async send(data: CreateNotificationDto): Promise<NotificationResponseDto> {
        const notification = await this.prisma.notification.create({ data })

        // Bắn tín hiệu sang Ably
        await this.ablyService.publish(
            `user-notifications:${notification.userId}`,
            notification.type,
            {
                ...notification,
                timestamp: new Date(),
            }
        )

        return plainToInstance(NotificationResponseDto, notification, {
            excludeExtraneousValues: true,
        })
    }

    /**
     * Send multiple notifications efficiently
     * Useful for notifying all admins or all project members at once
     */
    async sendMany(dataArray: CreateNotificationDto[]): Promise<void> {
        if (!dataArray.length) return

        try {
            // 1. Lưu vào Database hàng loạt (1 query duy nhất)
            // Note: createMany returns a count, so we fetch the data if we need the IDs,
            // but for simple notifications, firing Ably with the payload is often enough.
            await this.prisma.notification.createMany({
                data: dataArray,
                skipDuplicates: true,
            })

            // 2. Gửi tín hiệu Realtime qua Ably cho từng User
            const publishPromises = dataArray.map((item) =>
                this.ablyService.publish(
                    `user-notifications:${item.userId}`,
                    NotificationType.INFO,
                    {
                        ...item,
                        status: NotificationStatus.UNSEEN,
                        createdAt: new Date(),
                    }
                )
            )

            await Promise.all(publishPromises)
        } catch (error) {
            this.logger.error(
                `Failed to send bulk notifications: ${error.message}`
            )
        }
    }

    async findAll(userId: string): Promise<{
        notifications: NotificationResponseDto[]
        totalCount: number
        unseenCount: number
    }> {
        const [notifications, totalCount, unseenCount] = await Promise.all([
            this.prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                where: { userId },
            }),
            this.prisma.notification.count({
                where: { userId },
            }),
            this.prisma.notification.count({
                where: {
                    AND: [{ userId }, { status: NotificationStatus.UNSEEN }],
                },
            }),
        ])
        return {
            notifications: plainToInstance(
                NotificationResponseDto,
                notifications,
                {
                    excludeExtraneousValues: true,
                }
            ),
            unseenCount,
            totalCount,
        }
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
        data: UpdateNotificationDto
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
