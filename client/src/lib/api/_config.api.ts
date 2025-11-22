import { ApiResponse, axiosClient } from '@/lib/axios'
import { TCreateUserConfigInput, TUpdateUserConfigInput } from '@/lib/validationSchemas'
import { IConfigResponse } from '@/shared/interfaces'

export const configApi = {
	create: (data: TCreateUserConfigInput) => {
		return axiosClient.post<ApiResponse<IConfigResponse>>('/v1/configs', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<IConfigResponse[]>>('/v1/configs')
	},
	findById: (id: string) => {
		return axiosClient.get<ApiResponse<IConfigResponse>>(`/v1/configs/${id}`)
	},
	findByCode: (code: string) => {
		return axiosClient.get<ApiResponse<IConfigResponse>>(`/v1/configs/code/${code}`)
	},
	updateByCode: (code: string, data: TUpdateUserConfigInput) => {
		return axiosClient.patch<ApiResponse<{ code: string }>>(`/v1/configs/code/${code}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/configs/${id}`)
	},
}
