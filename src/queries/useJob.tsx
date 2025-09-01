'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { Job, JobActivityLog, NewJob } from '@/validationSchemas/job.schema'
import { queryClient } from '../app/providers/TanstackQueryProvider'
import { TJobTab } from '@/app/api/(protected)/jobs/utils/getTabQuery'
import useAuth from './useAuth'

type JobsResponse = {
    jobs: Job[]
    counts?: {
        priority: number
        active: number
        completed: number
        delivered: number
        late: number
        cancelled: number
    }
}
type PaginationMeta = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type TQueryJobParams = {
    tab?: TJobTab
    search?: string
    limit?: number
    page?: number
}
export const useJobs = (params?: TQueryJobParams) => {
    const { userRole } = useAuth()

    const hideCols = userRole === 'USER' ? ['income'] : []

    const {
        data,
        refetch,
        error,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: ['jobs', params?.tab ?? 'active', params?.page ?? 1],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobsResponse, PaginationMeta>>('jobs', {
                params: params,
            }),
        select: (res) => res.data,
    })

    const isLoading = isFirstLoading || isFetching

    return {
        refetch,
        isLoading,
        error,
        jobs: data?.result?.jobs,
        counts: data?.result?.counts,
        meta: data?.meta,
        hideCols,
    }
}

export const useCountJobByTab = (tab: TJobTab) => {
    const {
        data,
        refetch,
        error,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: ['jobs', 'count', tab ?? 'active'],
        queryFn: () =>
            axiosClient.get<ApiResponse<number>>('jobs/count', {
                params: {
                    tab,
                },
            }),
        select: (res) => res.data.result,
    })

    const isLoading = isFirstLoading || isFetching

    return {
        refetch,
        isLoading,
        error,
        data,
    }
}

export const useJobDetail = (jobNo?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobDetail', jobNo],
        queryFn: () =>
            axiosClient.get<ApiResponse<Job>>('jobs', {
                params: { jobNo },
            }),
        enabled: jobNo !== null && jobNo !== undefined,
        select: (res) => res.data,
    })
    return {
        refetch,
        job: data?.result,
        error,
        isLoading,
    }
}

export const useJobActivityLogs = (id?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobActivityLog', id],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobActivityLog[]>>(
                `jobs/${id}/activity-log`
            ),
        enabled: id !== null && id !== undefined,
        select: (res) => res.data,
    })
    return {
        refetch,
        activityLogs: data?.result,
        error,
        isLoading,
    }
}

export const useCreateJobMutation = () => {
    return useMutation({
        mutationKey: ['createJob'],
        mutationFn: (createJobInput: NewJob) => {
            return axiosClient.post('jobs', createJobInput)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}

export const useChangeStatusMutation = () => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({
            jobId,
            changeStatusInput,
        }: {
            jobId?: string
            changeStatusInput: {
                fromStatusId?: string
                toStatusId?: string
            }
        }) => {
            return axiosClient.patch<ApiResponse<Job>>(
                `jobs/${jobId}/change-status`,
                changeStatusInput
            )
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['jobDetail', data.data.result?.jobNo],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', data.data.result?.id],
            })
        },
    })
}

export const useUpdateJobMutation = () => {
    return useMutation({
        mutationKey: ['updateJob'],
        mutationFn: ({
            jobId,
            updateJobInput,
        }: {
            jobId?: string
            updateJobInput: Partial<Job>
        }) => {
            return axiosClient.patch(`jobs/${jobId}`, updateJobInput)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['jobDetail', data.data.result?.jobNo],
            })
        },
    })
}

export const useDeleteJobMutation = () => {
    return useMutation({
        mutationKey: ['deleteJob'],
        mutationFn: (id: number | string) => {
            return axiosClient.delete(`jobs/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}
