'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { Job, JobActivityLog, NewJob } from '@/validationSchemas/job.schema'
import { queryClient } from '../app/providers/TanstackQueryProvider'
import { TJobTab } from '@/app/api/(protected)/jobs/utils/getTabQuery'
import useAuth from './useAuth'
import { TJobVisibleColumn } from '../app/[locale]/(dashboard)/onboarding/store/useJobStore'

type JobsResponse = {
    jobs: Job[]
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
    hideFinishItems?: boolean
}
export const useJobs = (params?: TQueryJobParams) => {
    const {
        userRole,
        profile: { data: user },
    } = useAuth()

    const hideCols: TJobVisibleColumn[] = userRole === 'USER' ? ['income'] : []

    const {
        data,
        refetch,
        error,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: [
            'jobs',
            userRole, // Include userRole since it affects the endpoint
            user?.id, // Include user ID for USER role queries
            params?.tab ?? 'active',
            params?.limit ?? 10,
            params?.page ?? 1,
            params?.search ?? '',
            params?.hideFinishItems ?? false,
        ],
        queryFn: () => {
            if (userRole === 'ADMIN') {
                return axiosClient.get<
                    ApiResponse<JobsResponse, PaginationMeta>
                >('jobs', {
                    params: params,
                })
            }
            return axiosClient.get<ApiResponse<JobsResponse, PaginationMeta>>(
                `users/${user?.id}/jobs`,
                {
                    params: params,
                }
            )
        },
        enabled: userRole === 'ADMIN' || !!user?.id,
        select: (res) => res.data,
    })

    const isLoading = isFirstLoading || isFetching

    return {
        refetch,
        isLoading,
        error,
        jobs: data?.result?.jobs,
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

export const useJobActivityLogs = (jobId?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: jobId ? ['jobActivityLog', jobId] : ['jobActivityLog'],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobActivityLog[]>>(
                `jobs/${jobId}/activity-log`
            ),
        enabled: !!jobId,
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
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
        },
    })
}

type Props = { onSuccess?: () => void }
export const useAssignMemberMutation = ({ onSuccess }: Props) => {
    return useMutation({
        mutationKey: ['assignMember', 'job'],
        mutationFn: ({
            jobId,
            assignMemberInput,
        }: {
            jobId?: string
            assignMemberInput: {
                prevMemberIds?: string
                updateMemberIds?: string
            }
        }) => {
            return axiosClient.patch<ApiResponse<Job>>(
                `jobs/${jobId}/assign-member`,
                assignMemberInput
            )
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['jobDetail', data.data.result?.jobNo],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
            onSuccess?.()
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
