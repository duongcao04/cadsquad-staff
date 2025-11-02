import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobStatusInput, UpdateJobStatusInput } from '@/lib/validationSchemas'
import { Job, JobStatus } from '@/shared/interfaces'

export const jobStatusApi = {
	create: (data: CreateJobStatusInput) => {
		return axiosClient.post('/v1/job-statuses', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<JobStatus[]>>('/v1/job-statuses')
	},
	findJobsByStatusCode: (statusCode: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>(`/v1/job-statuses/code/${statusCode}/jobs`)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<JobStatus>>(`/v1/job-statuses/${id}`)
	},
	findByOrder: (orderNum: number) => {
		return axiosClient.get<ApiResponse<JobStatus>>(`/v1/job-statuses/order/${orderNum}`)
	},
	update: (id: string, data: UpdateJobStatusInput) => {
		return axiosClient.patch(`/v1/job-statuses/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/job-statuses/${id}`)
	},
}
