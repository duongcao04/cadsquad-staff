
import { axiosClient } from '@/lib/axios'
import { CreatePaymentChannelInput, UpdatePaymentChannelInput } from '@/shared/validationSchemas/paymentChannel.schema'

export const paymentChannelApi = {
	create: (data: CreatePaymentChannelInput) => {
		return axiosClient.post('/payment-channels', data)
	},
	findAll: () => {
		return axiosClient.get('/payment-channels')
	},
	findOne: (id: string) => {
		return axiosClient.get(`/payment-channels/${id}`)
	},
	update: (id: string, data: UpdatePaymentChannelInput) => {
		return axiosClient.patch(`/payment-channels/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/payment-channels/${id}`)
	},
}
