import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import {
    CreateNotificationInput,
    UpdateNotificationInput,
} from '@/shared/validationSchemas/notification.schema'
import { Notification } from '@/shared/interfaces/notification.interface'
import { notificationApi } from '@/app/api/notification.api'

export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () =>
            axiosClient.get<ApiResponse<Notification[]>>('notifications'),
        select: (res) => res.data.result,
    })
}

export const useSendNotificationMutation = () => {
    return useMutation({
        mutationKey: ['createNotification'],
        mutationFn: (sendNotification: CreateNotificationInput) => {
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
            data: UpdateNotificationInput
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
