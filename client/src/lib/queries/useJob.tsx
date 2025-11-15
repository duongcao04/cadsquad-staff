import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { jobApi, jobStatusApi } from '@/lib/api'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { USER_CONFIG_KEYS } from '@/lib/utils'
import {
    BulkChangeStatusInput,
    ChangeStatusInput,
    CreateJobInput,
    JobQueryWithFiltersInput,
} from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { Job, JobActivityLog } from '@/shared/interfaces'
import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import queryString from 'query-string'

export const useJobs = (
    params: JobQueryWithFiltersInput = {
        hideFinishItems: 0,
        page: 1,
        limit: 10,
        tab: ProjectCenterTabEnum.ACTIVE,
    }
) => {
    const { hideFinishItems, page, limit, search, tab, sort, ...filters } =
        params

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
            `sort=${sort}`,
            `filters=${queryString.stringify(filters)}`,
        ],
        queryFn: () => {
            const newParams = lodash.omitBy(params, lodash.isUndefined)
            return jobApi.findAll(newParams)
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

export const useSearchJobs = (keywords?: string) => {
    const {
        data,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: ['jobs', `search=${keywords}`],
        queryFn: () => {
            if (!keywords) {
                return
            }
            return jobApi.searchJobs(keywords)
        },
        enabled: !!keywords,
        select: (res) => res?.data.result,
    })

    return {
        isLoading: isFirstLoading || isFetching,
        jobs: data,
    }
}

export const useJobsByDeadline = (isoDate?: string) => {
    const {
        data,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: ['jobs', `deadline=${isoDate}`],
        queryFn: () => {
            if (!isoDate) {
                return
            }
            return jobApi.findByDeadline(isoDate)
        },
        enabled: !!isoDate,
        select: (res) => res?.data.result,
    })

    return {
        data,
        isLoading: isFirstLoading || isFetching,
    }
}

export const useJobColumns = () => {
    const { data: jobColumns } = useQuery({
        queryKey: ['configs', 'code', USER_CONFIG_KEYS.jobShowColumns],
        queryFn: () => jobApi.columns(),
        select: (res) => res.data.result,
    })
    return { jobColumns }
}

export const useJobsDueOnDate = (dueAt?: string) => {
    const {
        data: jobs,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['jobs', 'dueOn', dueAt ?? ''],
        queryFn: () => {
            if (!dueAt) {
                return
            }
            return jobApi.getJobsDueOnDate(dueAt)
        },
        enabled: !!dueAt,
        select: (res) => res?.data.result,
    })

    return { jobs, isLoading: isLoading || isFetching }
}

export const useCountJobByTab = (tab: ProjectCenterTabEnum) => {
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

export const useJobsByStatusCode = (statusCode?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobs', 'status', 'code', statusCode],
        queryFn: () => {
            if (!statusCode) {
                return undefined
            }
            return jobStatusApi.findJobsByStatusCode(statusCode)
        },
        enabled: !!statusCode,
        select: (res) => res?.data,
    })
    return {
        refetch,
        jobs: data?.result,
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
            queryClient.invalidateQueries({
                queryKey: ['jobTypes'],
            })
        },
    })
}

export const useChangeStatusMutation = () => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({
            jobId,
            data,
        }: {
            jobId?: string
            data: ChangeStatusInput
        }) => {
            if (!jobId) {
                throw new Error()
            }
            return jobApi.changeStatus(jobId, data)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', res.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(res.data.result?.id)],
            })
        },
    })
}

export const useBulkChangeStatusMutation = () => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({ data }: { data: BulkChangeStatusInput }) => {
            return jobApi.bulkChangeStatus(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
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
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', res.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'id', res.data.result?.id],
            })
        },
    })
}

export const useDeleteJobMutation = () => {
    return useMutation({
        mutationKey: ['deleteJob'],
        mutationFn: (id: string) => {
            return jobApi.remove(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}
