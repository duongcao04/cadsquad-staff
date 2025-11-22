import { notificationApi } from '@/lib/api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    TCreateNotificationInput,
    TUpdateNotificationInput,
} from '../validationSchemas'

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
