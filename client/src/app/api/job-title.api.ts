import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobTitleInput, UpdateJobTitleInput } from '@/shared/validationSchemas/job-title.schema'
import { JobTitle } from '@/shared/interfaces/jobTitle.interface'

export const jobTitleApi = {
	create: (data: CreateJobTitleInput) => axiosClient.post('/job-titles', data),
	findAll: () => axiosClient.get<ApiResponse<JobTitle[]>>('/job-titles'),
	findOne: (id: string) => axiosClient.get<ApiResponse<JobTitle>>(`/job-titles/${id}`),
	update: (id: string, data: UpdateJobTitleInput) => axiosClient.patch(`/job-titles/${id}`, data),
	remove: (id: string) => axiosClient.delete(`/job-titles/${id}`),
}
