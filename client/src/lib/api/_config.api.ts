import { axiosClient } from '@/lib/axios'
import { CreateConfigInput, UpdateConfigInput } from '@/lib/validationSchemas'

export const configApi = {
	create: (data: CreateConfigInput) => {
		return axiosClient.post('/v1/configs', data)
	},
	findAll: () => {
		return axiosClient.get('/v1/configs')
	},
	findById: (id: string) => {
		return axiosClient.get(`/v1/configs/${id}`)
	},
	findByCode: (code: string) => {
		return axiosClient.get(`/v1/configs/code/${code}`)
	},
	updateByCode: (code: string, data: UpdateConfigInput) => {
		return axiosClient.patch(`/v1/configs/code/${code}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/configs/${id}`)
	},
}
