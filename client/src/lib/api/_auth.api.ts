import { ApiResponse, axiosClient } from '@/lib/axios'
import { ILoginResponse, IRegisterUserInput, IValidateTokenResponse } from '@/shared/interfaces'
import { TUser } from '@/shared/types'
import { LoginInput } from '../validationSchemas'

export const authApi = {
	validateToken: async (token: string) => {
		return axiosClient.get<ApiResponse<IValidateTokenResponse>>('/v1/auth/validate-token', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res?.data?.result?.isValid)
	},
	register: async (data: IRegisterUserInput) => {
		return axiosClient.post('/v1/auth/register', data)
	},
	login: async (data: LoginInput) => {
		return axiosClient.post<Required<ApiResponse<ILoginResponse>>>('/v1/auth/login', data)
	},
	getProfile: () => {
		return axiosClient.get<ApiResponse<TUser>>('/v1/auth/profile')
	},
}
