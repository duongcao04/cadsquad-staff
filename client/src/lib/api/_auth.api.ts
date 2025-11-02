import { ApiResponse, axiosClient } from '@/lib/axios'
import { LoginUserDto, RegisterUserDto, User } from '@/shared/interfaces'

export const authApi = {
	validateToken: async (token: string) => {
		return axiosClient.get('/v1/auth/validate-token', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.data.result.isValid)
	},
	register: async (data: RegisterUserDto) => {
		return axiosClient.post('/v1/auth/register', data)
	},
	login: async (data: LoginUserDto) => {
		return axiosClient.post('/v1/auth/login', data)
	},
	getProfile: () => {
		return axiosClient.get<ApiResponse<User>>('/v1/auth/profile')
	},
}
