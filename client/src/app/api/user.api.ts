
import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateUserInput, UpdateUserInput } from '@/shared/validationSchemas/user.schema'
import { User } from '@/shared/interfaces/user.interface'
import { UpdatePasswordInput } from '../../shared/validationSchemas/auth.schema'

export const userApi = {
	create: (data: CreateUserInput) => {
		return axiosClient.post<ApiResponse<User>>('/users', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<User[]>>('/users')
	},
	checkUsernameValid: (username: string) => {
		return axiosClient.get<ApiResponse<{ isValid: 0 | 1 }>>(`/users/username/${username}`)
	},
	updatePassword: (data: UpdatePasswordInput) => {
		return axiosClient.patch<ApiResponse<{ message: string }>>('/users/update-password', data)
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
