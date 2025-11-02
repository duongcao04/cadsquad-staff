import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateDepartmentInput, UpdateDepartmentInput } from '@/lib/validationSchemas'
import { Department } from '@/shared/interfaces'

export const departmentApi = {
	create: (data: CreateDepartmentInput) => {
		return axiosClient.post('/v1/departments', data)
	},

	findAll: () => {
		return axiosClient.get<ApiResponse<Department[]>>('/v1/departments')
	},

	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<Department>>(`/v1/departments/${id}`)
	},

	update: (id: string, data: UpdateDepartmentInput) => {
		return axiosClient.patch(`/v1/departments/${id}`, data)
	},

	remove: (id: string) => {
		return axiosClient.delete(`/v1/departments/${id}`)
	},
}
