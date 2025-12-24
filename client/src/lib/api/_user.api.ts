import { type ApiResponse, axiosClient } from '@/lib/axios'
import type {
    TCreateUserInput,
    TResetPasswordInput,
    TUpdatePasswordInput,
    TUpdateUserInput,
} from '@/lib/validationSchemas'
import type { IUserResponse } from '@/shared/interfaces'

export interface IProfileOverview {
    summary: {
        totalEarnings: number,
        earningsTrend: number,
        jobsCompleted: number,
        hoursLogged: number,
        activeJobs: number,
    },
    charts: {
        financial: string,
        jobStatus: string,
    }
}
export const userApi = {
    create: (data: TCreateUserInput) => {
        return axiosClient.post<ApiResponse<IUserResponse>>('/v1/users', data)
    },
    findAll: async () => {
        return axiosClient.get<ApiResponse<{
            users: IUserResponse[],
            total: number
        }>>('/v1/users').then(res => res.data)
    },
    overview: async () => {
        return axiosClient.get<ApiResponse<IProfileOverview>>('/v1/analytics/profile-overview').then(res => res.data)
    },
    checkUsernameValid: (username: string) => {
        return axiosClient.get<ApiResponse<{ isValid: 0 | 1 }>>(
            `/v1/users/username/${username}`
        )
    },
    updatePassword: async (data: TUpdatePasswordInput) => {
        return axiosClient.patch<ApiResponse<{ username: string }>>(
            '/v1/users/update-password',
            data
        ).then(res => res.data)
    },
    resetPassword: (userId: string, data: TResetPasswordInput) => {
        return axiosClient.patch<ApiResponse<{ username: string }>>(
            `/v1/users/${userId}/reset-password`,
            data
        )
    },
    findOne: async (username: string) => {
        return axiosClient.get<ApiResponse<IUserResponse>>(`/v1/users/${username}`).then(res => res.data)
    },
    update: async (username: string, data: TUpdateUserInput) => {
        return axiosClient.patch<ApiResponse<{ id: string, username: string }>>(
            `/v1/users/${username}`,
            data
        ).then(res => res.data)
    },
    remove: (id: string) => {
        return axiosClient.delete<ApiResponse<{ username: string }>>(
            `/v1/users/${id}`
        )
    },
}
