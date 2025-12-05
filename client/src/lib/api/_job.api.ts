import { ApiResponse, axiosClient } from '@/lib/axios'
import {
    TBulkChangeStatusInput,
    TChangeStatusInput,
    TCreateJobInput,
    TJobQueryWithFiltersInput,
    TRescheduleJob,
    TUpdateJobInput,
    TUpdateJobMembersInput,
} from '@/lib/validationSchemas'
import { IJobResponse, IPaginate, IUserResponse } from '@/shared/interfaces'
import { JobColumnKey } from '@/shared/types'
import queryString from 'query-string'

export const jobApi = {
    create: (data: TCreateJobInput) => {
        return axiosClient.post('/v1/jobs', {
            ...data,
            startedAt: data.startedAt.toISOString(),
            dueAt: data.dueAt.toISOString(),
            incomeCost: data.incomeCost.toString(),
            staffCost: data.staffCost.toString(),
        })
    },
    findAll: (query: TJobQueryWithFiltersInput) => {
        const queryStringFormatter = queryString.stringify(query, {
            arrayFormat: 'comma',
        })
        return axiosClient.get<
            ApiResponse<{ data: IJobResponse[]; paginate: IPaginate }>
        >(`/v1/jobs?${queryStringFormatter}`)
    },
    findByDeadline: (isoDate: string) => {
        return axiosClient.get<ApiResponse<IJobResponse[]>>(
            `/v1/jobs/deadline/${isoDate}`
        )
    },
    searchJobs: (keywords: string) => {
        return axiosClient.get<ApiResponse<IJobResponse[]>>('/v1/jobs/search', {
            params: { keywords },
        })
    },
    getNextNo: (typeId: string) => {
        return axiosClient.get<ApiResponse<string>>('/v1/jobs/next-no', {
            params: { typeId },
        })
    },
    getJobsDueOnDate: (inputDate: string) => {
        return axiosClient.get<ApiResponse<IJobResponse[]>>(
            `/v1/jobs/dueOn/${inputDate}`
        )
    },
    columns: () => {
        return axiosClient.get<ApiResponse<JobColumnKey[]>>('/v1/jobs/columns')
    },
    findByJobNo: (jobNo: string) => {
        return axiosClient.get<ApiResponse<IJobResponse>>(
            `/v1/jobs/no/${jobNo}`
        )
    },
    findOne: (id: string) => {
        return axiosClient.get<ApiResponse<IJobResponse>>(`/v1/jobs/${id}`)
    },
    getAssignees: (id: string) => {
        return axiosClient.get<
            ApiResponse<{ assignees: IUserResponse[]; totalAssignees: number }>
        >(`/v1/jobs/${id}/assignees`)
    },
    getJobActivityLog: (id: string) => {
        return axiosClient.get(`/v1/jobs/${id}/activity-log`)
    },
    changeStatus: (id: string, data: TChangeStatusInput) => {
        return axiosClient.patch<ApiResponse<{ id: string; no: string }>>(
            `/v1/jobs/${id}/change-status`,
            data
        )
    },
    reschedule: (id: string, data: TRescheduleJob) => {
        return axiosClient.patch<ApiResponse<{ id: string; no: string }>>(
            `/v1/jobs/${id}/reschedule`,
            data
        )
    },
    bulkChangeStatus: (data: TBulkChangeStatusInput) => {
        return axiosClient.post(`/v1/jobs/bulk/change-status`, data)
    },
    removeMember: (id: string, memberId: string) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/jobs/${id}/member/${memberId}/remove`
        )
    },
    assignMember: (id: string, data: TUpdateJobMembersInput) => {
        return axiosClient.patch<ApiResponse<{ id: string }>>(
            `/v1/jobs/${id}/assign-member`,
            data
        )
    },
    update: (id: string, data: TUpdateJobInput) => {
        return axiosClient.patch<ApiResponse<{ id: string; no: string }>>(
            `/v1/jobs/${id}`,
            data
        )
    },
    remove: (jobId: string) => {
        return axiosClient.delete(`/v1/jobs/${jobId}`)
    },
}
