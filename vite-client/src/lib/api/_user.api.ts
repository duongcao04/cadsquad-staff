import { type ApiResponse, axiosClient } from '@/lib/axios'
import type {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '@/lib/validationSchemas'
import type { IUserResponse } from '@/shared/interfaces'

export const userApi = {
    create: (data: TCreateUserInput) => {
        return axiosClient.post<ApiResponse<IUserResponse>>('/v1/users', data)
    },
    findAll: async () => {
        return axiosClient.get<ApiResponse<IUserResponse[]>>('/v1/users').then(res => res.data)
    },
    checkUsernameValid: (username: string) => {
        return axiosClient.get<ApiResponse<{ isValid: 0 | 1 }>>(
            `/v1/users/username/${username}`
        )
    },
    updatePassword: (data: TUpdatePasswordInput) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            '/v1/users/update-password',
            data
        )
    },
    resetPassword: (userId: string, data: TResetPasswordInput) => {
        return axiosClient.patch<ApiResponse<{ username: string }>>(
            `/v1/users/${userId}/reset-password`,
            data
        )
    },
    findOne: async (id: string) => {
        return axiosClient.get<ApiResponse<IUserResponse>>(`/v1/users/${id}`).then(res => res.data)
    },
    update: (id: string, data: TUpdateUserInput) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/users/${id}`,
            data
        )
    },
    remove: (id: string) => {
        return axiosClient.delete<ApiResponse<{ username: string }>>(
            `/v1/users/${id}`
        )
    },
}
