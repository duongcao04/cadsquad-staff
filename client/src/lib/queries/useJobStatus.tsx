import { useQuery } from '@tanstack/react-query'
import { jobStatusApi } from '@/lib/api'

export const useJobStatuses = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['job-statuses'],
        queryFn: () => jobStatusApi.findAll(),
        select: (res) => res.data.result,
    })
    return {
        data,
        isLoading: isLoading || isFetching,
    }
}

export const useJobStatusDetail = (statusId?: string) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: statusId ? ['job-statuses', statusId] : ['job-statuses'],
        queryFn: () => {
            if (!statusId) {
                return undefined
            }
            return jobStatusApi.findOne(statusId)
        },
        enabled: !!statusId,
        select: (res) => res?.data.result,
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
                return undefined
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
