import { NotificationStatusEnum, NotificationTypeEnum } from '@/shared/enums'
import type { IUserNotificationResponse } from '@/shared/interfaces'
import type { TUserNotification } from '@/shared/types'
import { queryOptions } from '@tanstack/react-query'
import { notificationApi } from '../../api'

export const mapUserNotification: (
    item: IUserNotificationResponse
) => TUserNotification = (item) => ({
    id: item.id,
    user: item.user,
    title: item.title ?? '',
    content: item.content ?? '',
    imageUrl: item.imageUrl ?? '',
    sender: item.sender ?? null,
    redirectUrl: item.redirectUrl ?? '',
    type: item.type ?? NotificationTypeEnum.INFO,
    status: item.status ?? NotificationStatusEnum.UNSEEN,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
})

// --- Query Options ---

// 1. Danh sách notifications
export const notificationsListOptions = () => {
    return queryOptions({
        queryKey: ['notifications'],
        queryFn: () => notificationApi.findAll(),
        select: (res) => {
            const notificationsData = res.result?.notifications
            return ({
                notifications: Array.isArray(notificationsData)
                    ? notificationsData.map(mapUserNotification)
                    : [],
                totalCount: res.result?.totalCount ?? 0,
                unseenCount: res.result?.unseenCount ?? 0,
            })
        },
    })
}
