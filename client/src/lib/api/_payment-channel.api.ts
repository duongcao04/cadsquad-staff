import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreatePaymentChannelInput, UpdatePaymentChannelInput } from '@/lib/validationSchemas'
import { PaymentChannel } from '@/shared/interfaces'

export const paymentChannelApi = {
	create: (data: CreatePaymentChannelInput) => {
		return axiosClient.post('/v1/payment-channels', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<PaymentChannel[]>>('/v1/payment-channels')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<PaymentChannel>>(`/v1/payment-channels/${id}`)
	},
	update: (id: string, data: UpdatePaymentChannelInput) => {
		return axiosClient.patch(`/v1/payment-channels/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/payment-channels/${id}`)
	},
}
