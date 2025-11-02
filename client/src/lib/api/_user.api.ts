import { ApiResponse, axiosClient } from '@/lib/axios'
import { User } from '@/shared/interfaces'
import { CreateUserInput, ResetPasswordInput, UpdatePasswordInput, UpdateUserInput } from '@/lib/validationSchemas'

export const userApi = {
	create: (data: CreateUserInput) => {
		return axiosClient.post<ApiResponse<User>>('/v1/users', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<User[]>>('/v1/users')
	},
	checkUsernameValid: (username: string) => {
		return axiosClient.get<ApiResponse<{ isValid: 0 | 1 }>>(`/v1/users/username/${username}`)
	},
	updatePassword: (data: UpdatePasswordInput) => {
		return axiosClient.patch('/v1/users/update-password', data)
	},
	resetPassword: (userId: string, data: ResetPasswordInput) => {
		return axiosClient.patch<ApiResponse<{ username: string }>>(`/v1/users/${userId}/reset-password`, data)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<User>>(`/v1/users/${id}`)
	},
	update: (id: string, data: UpdateUserInput) => {
		return axiosClient.patch(`/v1/users/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete<ApiResponse<{ username: string }>>(`/v1/users/${id}`)
	},
}
