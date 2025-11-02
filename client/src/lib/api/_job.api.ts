import { ApiResponse, axiosClient } from '@/lib/axios'
import { JobColumn, JobColumnKey } from '@/shared/types'
import { ChangeStatusInput, CreateJobInput, JobQueryWithFiltersInput, UpdateJobMembersInput } from '@/lib/validationSchemas'
import { Job, Paginate } from '@/shared/interfaces'
import queryString from 'query-string'

export const jobApi = {
	create: (data: CreateJobInput) => {
		return axiosClient.post('/v1/jobs', data)
	},
	findAll: (query: JobQueryWithFiltersInput) => {
		const queryStringFormatter = queryString.stringify(query, {
			arrayFormat: 'comma',
		})
		return axiosClient.get<
			ApiResponse<{ data: Job[], paginate: Paginate }>
		>(`/v1/jobs?${queryStringFormatter}`)
	},
	searchJobs: (keywords: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>('/v1/jobs/search', { params: { keywords } })
	},
	getJobsDueOnDate: (inputDate: string) => {
		return axiosClient.get<
			ApiResponse<Job[]>
		>(`/v1/jobs/dueOn/${inputDate}`)
	},
	columns: () => {
		return axiosClient.get<ApiResponse<JobColumnKey[]>>('/v1/jobs/columns')
	},
	findByJobNo: (jobNo: string) => {
		return axiosClient.get<ApiResponse<Job>>(`/v1/jobs/no/${jobNo}`)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<Job>>(`/v1/jobs/${id}`)
	},
	getJobActivityLog: (id: string) => {
		return axiosClient.get(`/v1/jobs/${id}/activity-log`)
	},
	changeStatus: (id: string, data: ChangeStatusInput) => {
		return axiosClient.patch(`/v1/jobs/${id}/change-status`, data)
	},
	removeMember: (id: string, memberId: string) => {
		return axiosClient.patch(`/v1/jobs/${id}/member/${memberId}/remove`)
	},
	assignMember: (id: string, data: UpdateJobMembersInput) => {
		return axiosClient.patch(`/v1/jobs/${id}/assign-member`, data)
	},
	remove: (id: string) => {
		return axiosClient.delete(`/v1/jobs/${id}`)
	},
}
