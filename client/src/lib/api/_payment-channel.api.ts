import { ApiResponse, axiosClient } from '@/lib/axios'
import { TCreatePaymentChannelInput, TUpdatePaymentChannelInput } from '@/lib/validationSchemas'
import { IPaymentChannelResponse } from '@/shared/interfaces'

export const paymentChannelApi = {
	create: (data: TCreatePaymentChannelInput) => {
		return axiosClient.post('/v1/payment-channels', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<IPaymentChannelResponse[]>>('/v1/payment-channels')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<IPaymentChannelResponse>>(`/v1/payment-channels/${id}`)
	},
	update: (id: string, data: TUpdatePaymentChannelInput) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/payment-channels/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/payment-channels/${id}`)
	},
}
