import { type ApiResponse, axiosClient } from '@/lib/axios'
import {
    type TBulkChangeStatusInput,
    type TChangeStatusInput,
    type TCreateJobInput,
    type TJobQueryInput,
    type TRescheduleJob,
    type TUpdateJobInput,
    type TUpdateJobMembersInput,
} from '@/lib/validationSchemas'
import type {
    IJobResponse,
    IPaginate,
    IUserResponse,
} from '@/shared/interfaces'
import type { JobColumnKey, JobUpdateResponse } from '@/shared/types'
import queryString from 'query-string'
import { ProjectCenterTabEnum } from '../../shared/enums'

export const jobApi = {
    togglePin: async (jobId: string) => {
        return axiosClient.post<ApiResponse<{ isPinned: boolean, message: string }>>(`/v1/jobs/${jobId}/toggle-pin`).then(res => res.data)
    },
    create: async (data: TCreateJobInput) => {
        return axiosClient
            .post('/v1/jobs', {
                ...data,
                startedAt: new Date(data.startedAt).toISOString(),
                dueAt: new Date(data.dueAt).toISOString(),
                incomeCost: data.incomeCost.toString(),
                staffCost: data.staffCost.toString(),
            })
            .then((res) => res.data)
    },
    workbenchData: async (query: TJobQueryInput) => {
        const queryStringFormatter = queryString.stringify(query, {
            arrayFormat: 'comma',
        })
        return axiosClient
            .get<
                ApiResponse<{ data: IJobResponse[]; paginate: IPaginate }>
            >(`/v1/jobs/workbench?${queryStringFormatter}`)
            .then((res) => res.data)
    },
    findAll: async (query: TJobQueryInput) => {
        const queryStringFormatter = queryString.stringify(query, {
            arrayFormat: 'comma',
        })
        return axiosClient
            .get<
                ApiResponse<{ data: IJobResponse[]; paginate: IPaginate }>
            >(`/v1/jobs?${queryStringFormatter}`)
            .then((res) => res.data)
    },
    getJobsDueOnDate: async (isoDate: string) => {
        return axiosClient
            .get<ApiResponse<IJobResponse[]>>(`/v1/jobs/due-at/${isoDate}`)
            .then((res) => res.data)
    },
    searchJobs: async (keywords: string) => {
        return axiosClient
            .get<ApiResponse<IJobResponse[]>>('/v1/jobs/search', {
                params: { keywords },
            })
            .then((res) => res.data)
    },
    countTab: async (tab: ProjectCenterTabEnum) => {
        return axiosClient
            .get(`jobs/count`, { params: { tab } })
            .then((res) => res.data)
    },
    getNextNo: async (typeId: string) => {
        return axiosClient
            .get<ApiResponse<string>>('/v1/jobs/next-no', {
                params: { typeId },
            })
            .then((res) => res.data)
    },
    markPaid: async (jobId: string) => {
        return axiosClient
            .post<ApiResponse<{ id: string, no: string }>>(`/v1/jobs/${jobId}/mark-paid`)
            .then((res) => res.data)
    },
    columns: async () => {
        return axiosClient
            .get<ApiResponse<JobColumnKey[]>>('/v1/jobs/columns')
            .then((res) => res.data)
    },
    findByJobNo: async (jobNo: string) => {
        return axiosClient
            .get<ApiResponse<IJobResponse>>(`/v1/jobs/no/${jobNo}`)
            .then((res) => res.data)
    },
    findOne: async (id: string) => {
        return axiosClient
            .get<ApiResponse<IJobResponse>>(`/v1/jobs/${id}`)
            .then((res) => res.data)
    },
    getAssignees: async (id: string) => {
        return axiosClient
            .get<
                ApiResponse<{
                    assignees: IUserResponse[]
                    totalAssignees: number
                }>
            >(`/v1/jobs/${id}/assignees`)
            .then((res) => res.data)
    },
    getJobActivityLog: async (id: string) => {
        return axiosClient
            .get(`/v1/jobs/${id}/activity-log`)
            .then((res) => res.data)
    },
    changeStatus: async (id: string, data: TChangeStatusInput) => {
        return axiosClient
            .patch<
                ApiResponse<{ id: string; no: string }>
            >(`/v1/jobs/${id}/change-status`, data)
            .then((res) => res.data)
    },
    reschedule: async (id: string, data: TRescheduleJob) => {
        return axiosClient
            .patch<
                ApiResponse<{ id: string; no: string }>
            >(`/v1/jobs/${id}/reschedule`, data)
            .then((res) => res.data)
    },
    bulkChangeStatus: async (data: TBulkChangeStatusInput) => {
        return axiosClient
            .post(`/v1/jobs/bulk/change-status`, data)
            .then((res) => res.data)
    },
    removeMember: async (id: string, memberId: string) => {
        return axiosClient
            .patch<
                ApiResponse<{ id: string; no: string }>
            >(`/v1/jobs/${id}/member/${memberId}/remove`)
            .then((res) => res.data)
    },
    assignMember: async (id: string, data: TUpdateJobMembersInput) => {
        return axiosClient
            .patch<
                ApiResponse<JobUpdateResponse>
            >(`/v1/jobs/${id}/assign-member`, data)
            .then((res) => res.data)
    },
    update: async (id: string, data: TUpdateJobInput) => {
        return axiosClient
            .patch<ApiResponse<JobUpdateResponse>>(`/v1/jobs/${id}`, {
                ...data,
                incomeCost: data.incomeCost?.toString(),
                staffCost: data.staffCost?.toString(),
            })
            .then((res) => res.data)
    },
    remove: async (jobId: string) => {
        return axiosClient.delete(`/v1/jobs/${jobId}`).then((res) => res.data)
    },
}
