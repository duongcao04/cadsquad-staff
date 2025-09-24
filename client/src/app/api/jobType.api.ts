
import { axiosClient } from '@/lib/axios'
import { CreateJobTypeInput, UpdateJobTypeInput } from '@/shared/validationSchemas/jobType.schema'

export const jobTypeApi = {
	create: (data: CreateJobTypeInput) => {
		return axiosClient.post('/job-types', data)
	},
	findAll: () => {
		return axiosClient.get('/job-types')
	},
	findOne: (id: string) => {
		return axiosClient.get(`/job-types/${id}`)
	},
	update: (id: string, data: UpdateJobTypeInput) => {
		return axiosClient.patch(`/job-types/${id}`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/job-types/${id}`)
	},
}
