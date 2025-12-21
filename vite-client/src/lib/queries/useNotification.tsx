import { useMutation, useQuery } from '@tanstack/react-query'

import { notificationApi } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import {
    type TCreateNotificationInput,
    type TUpdateNotificationInput,
} from '@/lib/validationSchemas'
import { queryClient } from '../../main'
import { notificationsListOptions } from './options/notification-queries'

export const useNotifications = () => {
    const options = notificationsListOptions()

    const { data, refetch, error, isFetching, isLoading } = useQuery(options)

    // Data đã được map sẵn trong options.select
    return {
        refetch,
        isLoading: isLoading || isFetching,
        error,
        notifications: data?.notifications ?? [],
        totalCount: data?.totalCount ?? 0,
        unseenCount: data?.unseenCount ?? 0,
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
            queryClient.refetchQueries({ queryKey: ['notifications'] })
            onSuccess?.()
        },
    })
}
