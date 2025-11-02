import { axiosClient } from '@/lib/axios'
import { CreateNotificationInput, UpdateNotificationInput } from '@/lib/validationSchemas'

export const notificationApi = {
	create: (data: CreateNotificationInput) => {
		return axiosClient.post('/v1/notifications', data)
	},
	findAll: () => {
		return axiosClient.get('/v1/notifications')
	},
	findOne: (id: string) => {
		return axiosClient.get(`/v1/notifications/${id}`)
	},
	update: (id: string, data: UpdateNotificationInput) => {
		return axiosClient.patch(`/v1/notifications/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/notifications/${id}`)
	},
}
