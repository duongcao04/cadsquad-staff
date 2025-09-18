import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '../lib/axios'
import {
    NewNotification,
    Notification,
} from '@/validationSchemas/notification.schema'
import { queryClient } from '@/app/providers/TanstackQueryProvider'

export const useNoties = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () =>
            axiosClient.get<ApiResponse<Notification[]>>('notifications'),
        select: (res) => res.data.result,
    })
}

export const useSendNotiMutation = () => {
    return useMutation({
        mutationKey: ['createNoti'],
        mutationFn: (sendNoti: NewNotification) => {
            return axiosClient.post('notifications/send', sendNoti)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            })
        },
    })
}
