
import { axiosClient } from '@/lib/axios'
import { CreateNotificationInput, UpdateNotificationInput } from '@/shared/validationSchemas/notification.schema'

export const notificationApi = {
	create: (data: CreateNotificationInput) => {
		return axiosClient.post('/notifications', data)
	},
	findAll: () => {
		return axiosClient.get('/notifications')
	},
	findOne: (id: string) => {
		return axiosClient.get(`/notifications/${id}`)
	},
	update: (id: string, data: UpdateNotificationInput) => {
		return axiosClient.patch(`/notifications/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/notifications/${id}`)
	},
}
