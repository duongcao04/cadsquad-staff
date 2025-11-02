import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobTypeInput, UpdateJobTypeInput } from '@/lib/validationSchemas'
import { JobType } from '@/shared/interfaces'

export const jobTypeApi = {
	create: (data: CreateJobTypeInput) => {
		return axiosClient.post('/v1/job-types', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<JobType[]>>('/v1/job-types')
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<JobType>>(`/v1/job-types/${id}`)
	},
	update: (id: string, data: UpdateJobTypeInput) => {
		return axiosClient.patch(`/v1/job-types/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/job-types/${id}`)
	},
}
