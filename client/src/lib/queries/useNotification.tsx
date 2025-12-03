import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { notificationApi } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import {
    TCreateNotificationInput,
    TUpdateNotificationInput,
} from '@/lib/validationSchemas'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    NotificationStatusEnum,
    NotificationTypeEnum,
} from '../../shared/enums'
import { IUserNotificationResponse } from '../../shared/interfaces'
import { TUserNotification } from '../../shared/types'

export const mapUserNotification = (
    item: IUserNotificationResponse
): TUserNotification => {
    return {
        id: item.id,
        title: item.title ?? '',
        content: item.content ?? '',
        status: item.status ?? NotificationStatusEnum.UNSEEN,
        type: item.type ?? NotificationTypeEnum.INFO,
        user: item.user,
        imageUrl: item.imageUrl ?? null,
        redirectUrl: item.redirectUrl ?? null,
        sender: item.sender ?? null,
        updatedAt: new Date(item.updatedAt),
        createdAt: new Date(item.createdAt),
    }
}

export const useNotifications = () => {
    const { data, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => notificationApi.findAll(),
        select: (res) => res.data.result,
    })

    const notifications = useMemo(() => {
        const notificationsData = data

        if (!Array.isArray(notificationsData)) {
            return []
        }

        return notificationsData.map((item) => mapUserNotification(item))
    }, [data])

    return {
        data: notifications ?? [],
        isLoading: isLoading || isFetching,
        refetch,
    }
}

export const useSendNotificationMutation = () => {
    return useMutation({
        mutationKey: ['createNotification'],
        mutationFn: (sendNotification: TCreateNotificationInput) => {
            return axiosClient.post('notifications/send', sendNotification)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            })
        },
    })
}

export const useUpdateNotification = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string
            data: TUpdateNotificationInput
        }) => {
            const res = await notificationApi.update(id, data)
            return res.data
        },
        onSuccess: () => {
            // invalidate query notifications để refetch dữ liệu mới
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            onSuccess?.()
        },
    })
}
