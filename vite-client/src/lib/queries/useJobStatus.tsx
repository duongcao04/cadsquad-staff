import { useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'

import { jobStatusApi } from '@/lib/api'
import { mapJobStatus } from './options/job-status-queries'
export const useJobStatuses = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['job-statuses'],
        queryFn: () => jobStatusApi.findAll(),
        select: (res) => res.data.result,
    })
    const jobStatuses = useMemo(() => {
        const jobStatusesData = data

        if (!Array.isArray(jobStatusesData)) {
            return []
        }

        return jobStatusesData.map((item) => mapJobStatus(item))
    }, [data])

    return {
        data: jobStatuses ?? [],
        jobStatuses: jobStatuses ?? [],
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

    const jobStatus = useMemo(() => {
        const jobData = data

        if (lodash.isEmpty(jobData)) {
            return undefined
        }

        return mapJobStatus(jobData)
    }, [data])

    return {
        refetch,
        jobStatus: jobStatus,
        data: jobStatus,
        error,
        isLoading,
    }
}

export const useJobStatusByOrder = (orderNumber?: number | null) => {
    const { data, refetch, error, isLoading } = useQuery({
        queryKey: orderNumber ? ['job-statuses', 'order', orderNumber] : [],
        queryFn: () => {
            if (!orderNumber) {
                return
            }
            return jobStatusApi.findByOrder(orderNumber)
        },
        enabled: !!orderNumber,
        select: (res) => res?.data.result,
    })
    const jobStatus = useMemo(() => {
        const jobData = data

        if (lodash.isEmpty(jobData)) {
            return undefined
        }

        return mapJobStatus(jobData)
    }, [data])
    return {
        refetch,
        jobStatus: jobStatus,
        data: jobStatus,
        error,
        isLoading,
    }
}
