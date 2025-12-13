import { ApiResponse, axiosClient } from '@/lib/axios'
import { TCreateNotificationInput, TUpdateNotificationInput } from '@/lib/validationSchemas'
import { IUserNotificationResponse } from '@/shared/interfaces'

export const notificationApi = {
	create: (data: TCreateNotificationInput) => {
		return axiosClient.post<ApiResponse<IUserNotificationResponse>>('/v1/notifications', data)
	},
	// Get all user notification
	// userId get from Authentication Header 
	findAll: () => {
		return axiosClient.get<ApiResponse<IUserNotificationResponse[]>>('/v1/notifications')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<IUserNotificationResponse>>(`/v1/notifications/${id}`)
	},
	update: (id: string, data: TUpdateNotificationInput) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/notifications/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/notifications/${id}`)
	},
}
