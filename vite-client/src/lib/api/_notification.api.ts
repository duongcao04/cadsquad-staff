import { type ApiResponse, axiosClient } from '@/lib/axios'
import type {
    TCreateNotificationInput,
    TUpdateNotificationInput,
} from '@/lib/validationSchemas'
import type { IUserNotificationResponse } from '@/shared/interfaces'

export const notificationApi = {
    create: (data: TCreateNotificationInput) => {
        return axiosClient.post<ApiResponse<IUserNotificationResponse>>(
            '/v1/notifications',
            data
        )
    },
    // Get all user notification
    // userId get from Authentication Header
    findAll: async () => {
        return axiosClient
            .get<
                ApiResponse<{
                    notifications: IUserNotificationResponse[]
                    totalCount: number
                    unseenCount: number
                }>
            >('/v1/notifications')
            .then((res) => res.data)
    },
    findOne: (id: string) => {
        return axiosClient.get<ApiResponse<IUserNotificationResponse>>(
            `/v1/notifications/${id}`
        )
    },
    update: (id: string, data: TUpdateNotificationInput) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/notifications/${id}`,
            data
        )
    },
    remove: (id: string) => {
        return axiosClient.delete(`/v1/notifications/${id}`)
    },
}
