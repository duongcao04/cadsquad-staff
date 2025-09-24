
import { axiosClient } from '@/lib/axios'
import { LoginUserDto, RegisterUserDto } from '@/shared/interfaces/auth.interface'

export const authApi = {
	register: (data: RegisterUserDto) => {
		return axiosClient.post('/auth/register', data)
	},
	login: (data: LoginUserDto) => {
		return axiosClient.post('/auth/login', data)
	},
	getProfile: () => {
		return axiosClient.get('/auth/profile')
	},
}
