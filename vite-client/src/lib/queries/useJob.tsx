import { jobApi } from '@/lib/api'
import {
    TDeliverJobInput,
    type TBulkChangeStatusInput,
    type TChangeStatusInput,
    type TCreateJobInput,
    type TJobQueryInput,
    type TRescheduleJob,
    type TUpdateJobInput,
    type TUpdateJobMembersInput,
} from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { addToast } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../../main'
import { JobUpdateResponse } from '../../shared/types'
import type { ApiResponse } from '../axios'
import { onErrorToast } from './helper'
import {
    countJobByTabOptions,
    jobAssigneesOptions,
    jobByNoOptions,
    jobDetailOptions,
    jobsByStatusCodeOptions,
    jobsDueOnDateOptions,
    jobsListOptions,
    jobsSearchOptions,
} from './options/job-queries'

// --- QUERIES ---

export const useJobs = (
    params: TJobQueryInput = {
        hideFinishItems: '0',
        page: 1,
        limit: 10,
        tab: ProjectCenterTabEnum.ACTIVE,
    }
) => {
    // Gọi Options
    const options = jobsListOptions(params)

    const { data, refetch, error, isFetching, isLoading } = useQuery(options)

    // Data đã được map sẵn trong options.select
    return {
        refetch,
        isLoading: isLoading || isFetching,
        error,
        jobs: data?.jobs ?? [],
        data: data?.jobs ?? [],
        paginate: data?.paginate,
    }
}

export const useSearchJobs = (keywords?: string) => {
    const { data, isFetching, isLoading } = useQuery(
        jobsSearchOptions(keywords)
    )
    return {
        isLoading: isLoading || isFetching,
        jobs: data,
    }
}

export const useJobsDueOnDate = (isoDate: string) => {
    const { data, isFetching, isLoading } = useQuery(
        jobsDueOnDateOptions(isoDate)
    )
    return {
        data,
        isLoading: isLoading || isFetching,
    }
}

export const useCountJobByTab = (tab: ProjectCenterTabEnum) => {
    const { data, refetch, error, isFetching, isLoading } = useQuery(
        countJobByTabOptions(tab)
    )
    return {
        refetch,
        isLoading: isLoading || isFetching,
        error,
        data,
    }
}

export const useJobByNo = (jobNo: string) => {
    const { data, refetch, error, isLoading } = useQuery(jobByNoOptions(jobNo))
    return {
        refetch,
        data,
        job: data, // data đã được map trong select
        error,
        isLoading,
    }
}

export const useJobAssignees = (jobId: string) => {
    const { data, refetch, error, isLoading } = useQuery(
        jobAssigneesOptions(jobId)
    )
    return {
        refetch,
        data: data?.assignees ?? [],
        totalAssignees: data?.totalAssignees ?? 0,
        error,
        isLoading,
    }
}

export const useJobsByStatusCode = (statusCode?: string) => {
    const { data, refetch, error, isLoading } = useQuery(
        jobsByStatusCodeOptions(statusCode)
    )
    return {
        refetch,
        jobs: data,
        error,
        isLoading,
    }
}

export const useJobDetail = (id?: string) => {
    const { data, refetch, error, isLoading } = useQuery(jobDetailOptions(id))
    return {
        refetch,
        job: data,
        error,
        isLoading,
    }
}

// --- MUTATIONS (Giữ nguyên logic nhưng code gọn hơn 1 chút) ---
export const useCreateJobMutation = () => {
    return useMutation({
        mutationKey: ['createJob'],
        mutationFn: (data: TCreateJobInput) => jobApi.create(data),
        onSuccess: (res) => {
            addToast({ title: res.message, color: 'success' })
            queryClient.invalidateQueries({
                queryKey: jobsListOptions().queryKey,
            })
            queryClient.invalidateQueries({ queryKey: ['jobTypes'] })
        },
        onError: (err) => onErrorToast(err, 'Create Job Failed'),
    })
}

export const useChangeStatusMutation = (
    onSuccess?: (res: ApiResponse<JobUpdateResponse>) => void
) => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({
            jobId,
            data,
        }: {
            jobId: string
            data: TChangeStatusInput
        }) => jobApi.changeStatus(jobId, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: jobsListOptions().queryKey,
            })
            if (res.result?.no) {
                queryClient.invalidateQueries({
                    queryKey: jobByNoOptions(res.result?.no).queryKey,
                })
            }
            if (res.result?.id) {
                queryClient.invalidateQueries({
                    queryKey: ['jobActivityLog', String(res.result?.id)],
                })
            }
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({ title: res.message, color: 'success' })
            }
        },
        onError: (err) => onErrorToast(err, 'Change Status Failed'),
    })
}

export const useRescheduleMutation = (
    onSuccess?: (res: ApiResponse<JobUpdateResponse>) => void
) => {
    return useMutation({
        mutationKey: ['reschedule', 'job'],
        mutationFn: ({
            jobId,
            data,
        }: {
            jobId?: string
            data: TRescheduleJob
        }) => {
            if (!jobId) throw new Error('Job ID missing')
            return jobApi.reschedule(jobId, data)
        },
        onSuccess: (res) => {
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({ title: res.message, color: 'success' })
            }
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', res.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(res.result?.id)],
            })
        },
        onError: (err) => onErrorToast(err, 'Reschedule Failed'),
    })
}

export const useDeliverJobMutation = (
    onSuccess?: (res: ApiResponse) => void
) => {
    return useMutation({
        mutationKey: ['deliver', 'job'],
        mutationFn: ({
            jobId,
            data,
        }: {
            jobId: string
            data: Omit<TDeliverJobInput, 'jobId'>
        }) => jobApi.deliverJob(jobId, data),
        onSuccess: (res) => {
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({ title: res.message, color: 'success' })
            }
            queryClient.refetchQueries({ queryKey: ['jobs'] })
        },
        onError: (err) => onErrorToast(err, 'Deliver Job Failed'),
    })
}

export const useAdminDeliverJobMutation = (
    onSuccess?: (res: ApiResponse) => void
) => {
    return useMutation({
        mutationKey: ['deliver', 'job', 'admin-action'],
        mutationFn: ({
            deliveryId,
            action,
            feedback,
        }: {
            deliveryId: string
            action: 'approve' | 'reject'
            feedback?: string
        }) => jobApi.adminDeliverJobAction(deliveryId, action, feedback),
        onSuccess: (res) => {
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({ title: res.message, color: 'success' })
            }
            queryClient.refetchQueries({ queryKey: ['jobs'] })
        },
        onError: (err) => onErrorToast(err, 'Approve or Reject Job Failed'),
    })
}

export const useTogglePinJobMutation = () => {
    return useMutation({
        mutationKey: ['togglePin', 'job'],
        mutationFn: (jobId: string) => jobApi.togglePin(jobId),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            addToast({
                title: res.result?.isPinned ? 'Job pinned' : 'Job unpinned',
                description: res.result?.message,
                color: 'success',
            })
        },
        onError: (err) => onErrorToast(err, 'Pin job failed'),
    })
}

export const useBulkChangeStatusMutation = () => {
    return useMutation({
        mutationKey: ['changeStatus', 'job'],
        mutationFn: ({ data }: { data: TBulkChangeStatusInput }) =>
            jobApi.bulkChangeStatus(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            addToast({
                title: 'Change statuses successfully',
                description: res.message,
                color: 'success',
            })
        },
        onError: (err) => onErrorToast(err, 'Change statuses failed'),
    })
}

export const useAssignMemberMutation = (
    onSuccess?: (res: ApiResponse<JobUpdateResponse>) => void
) => {
    return useMutation({
        mutationKey: ['assignMember', 'job'],
        mutationFn: ({
            jobId,
            assignMemberInput,
        }: {
            jobId?: string
            assignMemberInput: TUpdateJobMembersInput
        }) => {
            if (!jobId) throw new Error('jobId is required')
            return jobApi.assignMember(jobId, assignMemberInput)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            if (res.result?.no) {
                queryClient.invalidateQueries({
                    queryKey: jobByNoOptions(res.result?.no).queryKey,
                })
            }
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(res.result?.id)],
            })
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({
                    title: 'Member assigned',
                    description: `A member has been assigned to job ${res.result?.no}.`,
                    color: 'success',
                })
            }
        },
        onError: (err) => onErrorToast(err, 'Failed to assign member'),
    })
}

export const useRemoveMemberMutation = (
    onSuccess?: (res: ApiResponse<JobUpdateResponse>) => void
) => {
    return useMutation({
        mutationKey: ['removeMember', 'job'],
        mutationFn: ({
            jobId,
            memberId,
        }: {
            jobId?: string
            memberId: string
        }) => {
            if (!jobId) return Promise.reject(new Error('jobId is required'))
            return jobApi.removeMember(jobId, memberId)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
            if (res.result?.no) {
                queryClient.invalidateQueries({
                    queryKey: jobByNoOptions(res.result?.no).queryKey,
                })
            }
            queryClient.invalidateQueries({
                queryKey: ['jobActivityLog', String(res.result?.id)],
            })
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({
                    title: 'Member removed',
                    description: `A member has been removed from job ${res.result?.no}.`,
                    color: 'success',
                })
            }
        },
        onError: (err) => onErrorToast(err, 'Failed to remove member'),
    })
}

type JobUpdateVariables = {
    jobId: string
    data: TUpdateJobInput // Your partial update type
}
export const useUpdateJobMutation = (
    onSuccess?: (res: ApiResponse<JobUpdateResponse>) => void
) => {
    return useMutation({
        mutationKey: ['updateJob'],
        mutationFn: ({ jobId, data }: JobUpdateVariables) =>
            jobApi.update(jobId, data),
        onSuccess: (res) => {
            if (onSuccess) {
                onSuccess(res)
            } else {
                addToast({ title: 'Update job successfully', color: 'success' })
            }
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'no', res.result?.no],
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs', 'id', res.result?.id],
            })
        },
    })
}

export const useDeleteJobMutation = () => {
    return useMutation({
        mutationKey: ['deleteJob'],
        mutationFn: (jobId?: string) => {
            if (!jobId) throw new Error('JobID is required')
            return jobApi.remove(jobId)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            addToast({
                title: 'Delete job successfully',
                description: `${res.message}`,
                color: 'success',
            })
        },
        onError: (err) => onErrorToast(err, 'Delete job failed'),
    })
}
export const useMarkPaidMutation = () => {
    return useMutation({
        mutationKey: ['mark-paid', 'job'],
        mutationFn: (jobId: string) => {
            return jobApi.markPaid(jobId)
        },
        onSuccess: (res) => {
            addToast({
                title: 'Mark as paid successfully',
                description: `#${res.result?.no} has been marked as paid`,
                color: 'success',
            })
            queryClient.invalidateQueries({
                queryKey: ['jobs'],
            })
        },
        onError: (err) => onErrorToast(err, 'Mark as paid failed'),
    })
}
