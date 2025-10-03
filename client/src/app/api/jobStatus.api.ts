
import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobStatusInput, UpdateJobStatusInput } from '@/shared/validationSchemas/jobStatus.schema'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { Job } from '../../shared/interfaces/job.interface'

export const jobStatusApi = {
	create: (data: CreateJobStatusInput) => {
		return axiosClient.post('/job-statuses', data)
	},
	findAll: () => {
		return axiosClient.get<ApiResponse<JobStatus[]>>('/job-statuses')
	},
	findJobsByStatusCode: (statusCode: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>(`/job-statuses/code/${statusCode}/jobs`)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<JobStatus>>(`/job-statuses/${id}`)
	},
	findByOrder: (orderNum: number) => {
		return axiosClient.get<ApiResponse<JobStatus>>(`/job-statuses/order/${orderNum}`)
	},
	update: (id: string, data: UpdateJobStatusInput) => {
		return axiosClient.patch(`/job-statuses/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/job-statuses/${id}`)
	},
}
