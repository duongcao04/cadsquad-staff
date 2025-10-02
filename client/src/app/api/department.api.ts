import { ApiResponse, axiosClient } from '@/lib/axios'
import { Department } from '@/shared/interfaces/department.interface'
import { CreateDepartmentInput, UpdateDepartmentInput } from '@/shared/validationSchemas/department.schema'

export const departmentApi = {
	create: (data: CreateDepartmentInput) => {
		return axiosClient.post('/departments', data)
	},

	findAll: () => {
		return axiosClient.get<ApiResponse<Department[]>>('/departments')
	},

	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<Department>>(`/departments/${id}`)
	},

	update: (id: string, data: UpdateDepartmentInput) => {
		return axiosClient.patch(`/departments/${id}`, data)
	},

	remove: (id: string) => {
		return axiosClient.delete(`/departments/${id}`)
	},
}
