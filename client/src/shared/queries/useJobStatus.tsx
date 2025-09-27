import { useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { jobStatusApi } from '@/app/api/jobStatus.api'

export const useJobStatuses = () => {
    return useQuery({
        queryKey: ['job-statuses'],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobStatus[]>>('job-statuses'),
        select: (res) => res.data.result,
    })
}

export const useJobStatusDetail = (statusId?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: statusId ? ['job-statuses', statusId] : ['job-statuses'],
        queryFn: () =>
            axiosClient.get<ApiResponse<JobStatus>>(`job-statuses/${statusId}`),
        enabled: !!statusId,
        select: (res) => res.data.result,
    })
    return {
        refetch,
        jobStatus: data,
        error,
        isLoading,
    }
}

export const useJobStatusByOrder = (orderNumber?: number | null) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: orderNumber ? ['job-statuses', 'order', orderNumber] : [],
        queryFn: () => {
            if (!orderNumber) {
                return null
            }
            return jobStatusApi.findByOrder(orderNumber)
        },
        enabled: !!orderNumber,
        select: (res) => res?.data.result,
    })
    return {
        refetch,
        jobStatus: data,
        error,
        isLoading,
    }
}
