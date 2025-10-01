import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { Job } from '@/shared/interfaces/job.interface'
import { JobActivityLog } from '@/shared/interfaces/jobActivityLog.interface'
import {
    CreateJobInput,
    JobQueryInput,
} from '@/shared/validationSchemas/job.schema'
import { JobTabEnum } from '@/shared/enums/jobTab.enum'
import { jobApi } from '@/app/api/job.api'
import { CONFIG_CONSTANTS } from '../constants/config.constant'

export const useJobs = (
    params: JobQueryInput = {
        hideFinishItems: 0,
        page: 1,
        limit: 10,
        tab: JobTabEnum.ACTIVE,
    }
) => {
    const { hideFinishItems, page, limit, search, tab } = params

    const {
        data,
        refetch,
        error,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: [
            'jobs',
            `tab=${tab}`,
            `limit=${limit}`,
            `page=${page}`,
            `keywords=${search}`,
            `isHideFinishItems=${hideFinishItems}`,
        ],
        queryFn: () => {
            return jobApi.findAll(params)
        },
        select: (res) => res.data,
    })

    return {
        refetch,
        isLoading: isFirstLoading || isFetching,
        error,
        jobs: data?.result?.data,
        paginate: data?.result?.paginate,
    }
}

export const useJobColumns = () => {
    const { data: jobColumns } = useQuery({
        queryKey: ['configs', 'code', CONFIG_CONSTANTS.keys.jobShowColumns],
        queryFn: () => jobApi.columns(),
        select: (res) => res.data.result,
    })
    return { jobColumns }
}

export const useCountJobByTab = (tab: JobTabEnum) => {
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

export const useJobByNo = (jobNo?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobs', 'no', jobNo],
        queryFn: () => {
            if (!jobNo) {
                return
            }
            return jobApi.findByJobNo(jobNo)
        },
        enabled: jobNo !== null && jobNo !== undefined,
        select: (res) => res?.data,
    })
    return {
        refetch,
        job: data?.result,
        error,
        isLoading,
    }
}

export const useJobDetail = (id?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobs', 'id', id],
        queryFn: () => {
            if (!id) {
                return
            }
            return jobApi.findOne(id)
        },
        enabled: !!id,
        select: (res) => res?.data,
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
        mutationFn: (createJobInput: CreateJobInput) => {
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
                queryKey: ['jobDetail', data.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
        },
    })
}

type Props = { onSuccess?: (data: ApiResponse<Job>) => void }
export const useAssignMemberMutation = ({ onSuccess }: Props = {}) => {
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
            const res = data.data
            queryClient.invalidateQueries({
                queryKey: ['jobDetail', data.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
            onSuccess?.(res)
        },
    })
}

export const useRemoveMemberMutation = () => {
    return useMutation({
        mutationKey: ['removeMember', 'job'],
        mutationFn: ({
            jobId,
            memberId,
        }: {
            jobId?: string
            memberId: string
        }) => {
            if (!jobId) {
                return Promise.reject(new Error('jobId is required'))
            }
            return jobApi.removeMember(jobId, memberId)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['jobDetail', data.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}

export const useUpdateJobMutation = (onSucess?: () => void) => {
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
                queryKey: ['jobs', 'no', data.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'id', data.data.result?.id],
            })
            onSucess?.()
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
