import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobTitleInput, UpdateJobTitleInput } from '@/lib/validationSchemas'
import { JobTitle } from '@/shared/interfaces'

export const jobTitleApi = {
	create: (data: CreateJobTitleInput) => axiosClient.post('/v1/job-titles', data),
	findAll: () => axiosClient.get<ApiResponse<JobTitle[]>>('/v1/job-titles'),
	findOne: (id: string) => axiosClient.get<ApiResponse<JobTitle>>(`/v1/job-titles/${id}`),
	update: (id: string, data: UpdateJobTitleInput) => axiosClient.patch(`/v1/job-titles/${id}`, data),
	remove: (id: string) => axiosClient.delete(`/v1/job-titles/${id}`),
}
