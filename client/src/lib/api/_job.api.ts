import { ApiResponse, axiosClient } from '@/lib/axios'
import { TBulkChangeStatusInput, TChangeStatusInput, TCreateJobInput, TJobQueryWithFiltersInput, TUpdateJobMembersInput } from '@/lib/validationSchemas'
import { IJobResponse, IPaginate } from '@/shared/interfaces'
import { JobColumnKey } from '@/shared/types'
import queryString from 'query-string'

export const jobApi = {
	create: (data: TCreateJobInput) => {
		return axiosClient.post('/v1/jobs', data)
	},
	findAll: (query: TJobQueryWithFiltersInput) => {
		const queryStringFormatter = queryString.stringify(query, {
			arrayFormat: 'comma',
		})
		return axiosClient.get<
			ApiResponse<{ data: IJobResponse[], paginate: IPaginate }>
		>(`/v1/jobs?${queryStringFormatter}`)
	},
	findByDeadline: (isoDate: string) => {
		return axiosClient.get<
			ApiResponse<IJobResponse[]>
		>(`/v1/jobs/deadline/${isoDate}`)
	},
	searchJobs: (keywords: string) => {
		return axiosClient.get<
			ApiResponse<IJobResponse[]>
		>('/v1/jobs/search', { params: { keywords } })
	},
	getJobsDueOnDate: (inputDate: string) => {
		return axiosClient.get<
			ApiResponse<IJobResponse[]>
		>(`/v1/jobs/dueOn/${inputDate}`)
	},
	columns: () => {
		return axiosClient.get<ApiResponse<JobColumnKey[]>>('/v1/jobs/columns')
	},
	findByJobNo: (jobNo: string) => {
		return axiosClient.get<ApiResponse<IJobResponse>>(`/v1/jobs/no/${jobNo}`)
	},
	findOne: (id: string) => {
		return axiosClient.get<ApiResponse<IJobResponse>>(`/v1/jobs/${id}`)
	},
	getJobActivityLog: (id: string) => {
		return axiosClient.get(`/v1/jobs/${id}/activity-log`)
	},
	changeStatus: (id: string, data: TChangeStatusInput) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/jobs/${id}/change-status`, data)
	},
	bulkChangeStatus: (data: TBulkChangeStatusInput) => {
		return axiosClient.post(`/v1/jobs/bulk/change-status`, data)
	},
	removeMember: (id: string, memberId: string) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/jobs/${id}/member/${memberId}/remove`)
	},
	assignMember: (id: string, data: TUpdateJobMembersInput) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/jobs/${id}/assign-member`, data)
	},
	remove: (jobId: string) => {
		return axiosClient.delete(`/v1/jobs/${jobId}`)
	},
}
