import { ApiResponse, axiosClient } from '@/lib/axios'
import { CreateJobInput, ChangeStatusInput, UpdateJobMembersInput, JobQueryWithFiltersInput } from '@/shared/validationSchemas/job.schema'
import { JobColumn } from '@/shared/types/job.type'
import { Job } from '@/shared/interfaces/job.interface'
import { Paginate } from '@/shared/interfaces/paginate.interface'
import queryString from 'query-string'

export const jobApi = {
	create: (data: CreateJobInput) => {
		return axiosClient.post('/jobs', data)
	},
	findAll: (query: JobQueryWithFiltersInput) => {
		const queryStringFormatter = queryString.stringify(query, {
			arrayFormat: 'comma',
		})
		return axiosClient.get<
			ApiResponse<{ data: Job[], paginate: Paginate }>
		>(`/jobs?${queryStringFormatter}`)
	},
	searchJobs: (keywords: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>('/jobs/search', { params: { keywords } })
	},
	getJobsDueOnDate: (inputDate: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>(`/jobs/dueOn/${inputDate}`)
	},
	columns: () => {
		return axiosClient.get<ApiResponse<JobColumn[]>>('/jobs/columns')
	},
	findByJobNo: (jobNo: string) => {
		return axiosClient.get<ApiResponse<Job>>(`/jobs/no/${jobNo}`)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<Job>>(`/jobs/${id}`)
	},
	getJobActivityLog: (id: string) => {
		return axiosClient.get(`/jobs/${id}/activity-log`)
	},
	changeStatus: (id: string, data: ChangeStatusInput) => {
		return axiosClient.patch(`/jobs/${id}/change-status`, data)
	},
	removeMember: (id: string, memberId: string) => {
		return axiosClient.patch(`/jobs/${id}/member/${memberId}/remove`)
	},
	assignMember: (id: string, data: UpdateJobMembersInput) => {
		return axiosClient.patch(`/jobs/${id}/assign-member`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/jobs/${id}`)
	},
}
