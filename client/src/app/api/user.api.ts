
import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateUserInput, UpdateUserInput } from '@/shared/validationSchemas/user.schema'
import { User } from '@/shared/interfaces/user.interface'

export const userApi = {
	create: (data: CreateUserInput) => {
		return axiosClient.post<ApiResponse<User>>('/users', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<User[]>>('/users')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<User>>(`/users/${id}`)
	},
	update: (id: string, data: UpdateUserInput) => {
		return axiosClient.patch(`/users/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/users/${id}`)
	},
}
