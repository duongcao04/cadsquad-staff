
import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreatePaymentChannelInput, UpdatePaymentChannelInput } from '@/shared/validationSchemas/paymentChannel.schema'
import { PaymentChannel } from '@/shared/interfaces/paymentChannel.interface'

export const paymentChannelApi = {
	create: (data: CreatePaymentChannelInput) => {
		return axiosClient.post('/payment-channels', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<PaymentChannel[]>>('/payment-channels')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<PaymentChannel>>(`/payment-channels/${id}`)
	},
	update: (id: string, data: UpdatePaymentChannelInput) => {
		return axiosClient.patch(`/payment-channels/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/payment-channels/${id}`)
	},
}
