import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { CreateNotificationInput } from '@/shared/validationSchemas/notification.schema'
import { Notification } from '@/shared/interfaces/notification.interface'

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
