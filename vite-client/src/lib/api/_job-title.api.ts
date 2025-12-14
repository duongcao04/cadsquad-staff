import { type ApiResponse, axiosClient } from '@/lib/axios'
import type {
    TCreateJobTitleInput,
    TUpdateJobTitleInput,
} from '@/lib/validationSchemas'
import type { IJobTitleResponse } from '@/shared/interfaces'

export const jobTitleApi = {
    create: (data: TCreateJobTitleInput) =>
        axiosClient.post<ApiResponse<IJobTitleResponse>>(
            '/v1/job-titles',
            data
        ),
    findAll: () =>
        axiosClient.get<ApiResponse<IJobTitleResponse[]>>('/v1/job-titles'),
    findOne: (id: string) =>
        axiosClient.get<ApiResponse<IJobTitleResponse>>(`/v1/job-titles/${id}`),
    update: (id: string, data: TUpdateJobTitleInput) =>
        axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/job-titles/${id}`,
            data
        ),
    remove: (id: string) => axiosClient.delete(`/v1/job-titles/${id}`),
}
