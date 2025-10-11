
import { ApiResponse, axiosClient } from '@/lib/axios'
import { LoginUserDto, RegisterUserDto } from '@/shared/interfaces/auth.interface'
import { User } from '@/shared/interfaces/user.interface'

export const authApi = {
	validateToken: async (token: string) => {
		return axiosClient.get('/auth/validate-token', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.data.result.isValid)
	},
	register: async (data: RegisterUserDto) => {
		return axiosClient.post('/auth/register', data)
	},
	login: async (data: LoginUserDto) => {
		return axiosClient.post('/auth/login', data)
	},
	getProfile: () => {
		return axiosClient.get<ApiResponse<User>>('/auth/profile')
	},
}
