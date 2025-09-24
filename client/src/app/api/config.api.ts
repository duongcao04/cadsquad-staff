
import { axiosClient } from '@/lib/axios'
import { CreateConfigInput, UpdateConfigInput } from '@/shared/validationSchemas/config.schema'

export const configApi = {
	create: (data: CreateConfigInput) => {
		return axiosClient.post('/configs', data)
	},
	findAll: () => {
		return axiosClient.get('/configs')
	},
	findById: (id: string) => {
		return axiosClient.get(`/configs/${id}`)
	},
	findByCode: (code: string) => {
		return axiosClient.get(`/configs/code/${code}`)
	},
	updateByCode: (code: string, data: UpdateConfigInput) => {
		return axiosClient.patch(`/configs/code/${code}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/configs/${id}`)
	},
}
