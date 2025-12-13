import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { jobApi, jobStatusApi } from '@/lib/api'
import { ApiError, ApiResponse, axiosClient } from '@/lib/axios'
import { USER_CONFIG_KEYS } from '@/lib/utils'
import {
    ChangeStatusInput,
    TBulkChangeStatusInput,
    TCreateJobInput,
    TJobQueryInput,
    TRescheduleJob,
    TUpdateJobInput,
    TUpdateJobMembersInput,
} from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { addToast } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useTranslations } from 'next-intl'
import queryString from 'query-string'
import { useMemo } from 'react'
import { IJobActivityLogResponse, IJobResponse } from '../../shared/interfaces'
import { TJob } from '../../shared/types'
import { mapUser } from './useUser'

export const mapJob: (item: IJobResponse) => TJob = (item) => ({
    no: item.no,
    displayName: item.displayName,
    assignee: item.assignee ?? [],
    activityLog: item.activityLog ?? [],
    attachmentUrls: item.attachmentUrls ?? [],
    clientName: item.clientName ?? '',
    createdBy: item.createdBy,
    files: item.files,
    id: item.id,
    comments: item.comments ?? [],
    incomeCost:
        typeof item.incomeCost === 'number'
            ? item.incomeCost
            : parseInt(item.incomeCost),
    staffCost:
        typeof item.staffCost === 'number'
            ? item.staffCost
            : parseInt(item.staffCost),
    isPaid: Boolean(item.isPaid),
    isPinned: Boolean(item.isPinned),
    isPublished: Boolean(item.isPublished),
    paymentChannel: item.paymentChannel,
    priority: item.priority,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    description: item.description,
    paidAt: item.paidAt,
    type: item.type,
    updatedAt: new Date(item.updatedAt),
    finishedAt: item.finishedAt ? new Date(item.finishedAt) : null,
    createdAt: new Date(item.createdAt),
    dueAt: new Date(item.dueAt),
    completedAt: item.completedAt ? new Date(item.completedAt) : null,
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,
    startedAt: new Date(item.startedAt),
})

export const useJobs = (
    params: TJobQueryInput = {
        hideFinishItems: '0',
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

    const jobs = useMemo(() => {
        const jobsData = data?.result?.data

        if (!Array.isArray(jobsData)) {
            return []
        }

        return jobsData.map((item) => mapJob(item))
    }, [data?.result?.data])

    return {
        refetch,
        isLoading: isFirstLoading || isFetching,
        error,
        jobs: jobs ?? [],
        data: jobs ?? [],
        paginate: data?.result?.paginate,
    }
}

export const useSearchJobs = (keywords?: string) => {
    const {
        data,
        isFetching,
        isLoading: isFirstLoading,
    } = useQuery({
        queryKey: ['jobs', 'search', keywords],
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
    const { data } = useQuery({
        queryKey: ['configs', 'code', USER_CONFIG_KEYS.jobShowColumns],
        queryFn: () => jobApi.columns(),
        select: (res) => res.data.result,
    })
    return { jobColumns: data ?? [] }
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

export const useJobByNo = (jobNo: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobs', 'no', jobNo],
        queryFn: () => jobApi.findByJobNo(jobNo),
        enabled: !!jobNo,
        select: (res) => res?.data,
    })

    const job = useMemo(() => {
        const jobData = data?.result

        if (lodash.isEmpty(jobData)) {
            return undefined
        }

        return mapJob(jobData)
    }, [data?.result])

    return {
        refetch,
        data: job,
        job: job,
        error,
        isLoading,
    }
}

export const useJobAssignees = (jobId: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: ['jobs', 'assignees', 'id', jobId],
        queryFn: () => {
            return jobApi.getAssignees(jobId)
        },
        enabled: !!jobId,
        select: (res) => res?.data,
    })

    const assignees = useMemo(() => {
        const assigneesData = data?.result?.assignees

        if (!Array.isArray(assigneesData)) {
            return []
        }

        return assigneesData.map((item) => mapUser(item))
    }, [data?.result?.assignees])

    return {
        refetch,
        data: assignees ?? [],
        totalAssignees: data?.result?.totalAssignees ?? 0,
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
            axiosClient.get<ApiResponse<IJobActivityLogResponse[]>>(
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
        mutationFn: (data: TCreateJobInput) => {
            return jobApi.create(data)
        },
        onSuccess: (res) => {
            addToast({ title: res.data.message, color: 'success' })
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobTypes'],
            })
        },
        onError(error) {
            const errorRes = error as unknown as ApiError
            addToast({
                title: errorRes.error,
                description: `Error: ${errorRes.message}`,
                color: 'danger',
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
            addToast({
                title: res.data.message,
                color: 'success',
            })
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
        onError: (error) => {
            const err = error as unknown as ApiError
            addToast({
                title: err.message,
                color: 'danger',
            })
        },
    })
}

export const useRescheduleMutation = () => {
    return useMutation({
        mutationKey: ['reschedule', 'job'],
        mutationFn: ({
            jobId,
            data,
        }: {
            jobId?: string
            data: TRescheduleJob
        }) => {
            if (!jobId) {
                throw new Error()
            }
            return jobApi.reschedule(jobId, data)
        },
        onSuccess: (res) => {
            addToast({
                title: res.data.message,
                color: 'success',
            })
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
        onError: (error) => {
            const err = error as unknown as ApiError
            addToast({
                title: err.message,
                color: 'danger',
            })
        },
    })
}

export const useBulkChangeStatusMutation = () => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({ data }: { data: TBulkChangeStatusInput }) => {
            return jobApi.bulkChangeStatus(data)
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
    })
}

export const useAssignMemberMutation = (jobNo?: string) => {
    return useMutation({
        mutationKey: ['assignMember', 'job'],
        mutationFn: ({
            jobId,
            assignMemberInput,
        }: {
            jobId?: string
            assignMemberInput: TUpdateJobMembersInput
        }) => {
            if (!jobId) {
                throw new Error('jobId is required')
            }
            return jobApi.assignMember(jobId, assignMemberInput)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', jobNo],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(data.data.result?.id)],
            })
            addToast({
                title: 'Phân công thành viên thành công',
                color: 'success',
            })
        },
        onError: (error) => {
            const err = error as unknown as ApiError
            addToast({
                title: 'Phân công thành viên thất bại',
                description: err.message,
                color: 'danger',
            })
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
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', res.data.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(res.data.result?.id)],
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
            data,
        }: {
            jobId: string
            data: TUpdateJobInput
        }) => {
            return jobApi.update(jobId, data)
        },
        onSuccess: (res) => {
            addToast({
                title: 'Cập nhật job thành công',
                color: 'success',
            })
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
    const t = useTranslations()
    return useMutation({
        mutationKey: ['deleteJob'],
        mutationFn: (jobId?: string) => {
            if (jobId) {
                return jobApi.remove(jobId)
            } else {
                throw new Error('JobID is required')
            }
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            addToast({
                title: t('successfully'),
                description: t('deletedJob', {
                    jobNo: `#${res.data.result?.jobNo}`,
                }),
                color: 'success',
            })
        },
        onError(error) {
            const err = error as unknown as ApiError
            addToast({
                title: t('failed'),
                description: err.message,
                color: 'danger',
            })
        },
    })
}
