import { notificationApi } from '@/app/api/notification.api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { Notification } from '@/shared/interfaces/notification.interface'
import {
    CreateNotificationInput,
    UpdateNotificationInput,
} from '@/shared/validationSchemas/notification.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useNotifications = () => {
    const { data, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: () =>
            axiosClient.get<ApiResponse<Notification[]>>('notifications'),
        select: (res) => res.data.result,
    })

    return {
        data,
        isLoading: isLoading || isFetching,
        refetch,
    }
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
