import { jobStatusApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'
import { IJobStatusResponse } from '../../shared/interfaces'
import { TJobStatus } from '../../shared/types'

const mapItem: (item: IJobStatusResponse) => TJobStatus = (item) => ({
    code: item.code ?? '',
    hexColor: item.hexColor ?? '#ffffff',
    jobs: item.jobs ?? [],
    order: item.order ?? 0,
    icon: item.icon ?? '',
    nextStatusOrder: item.nextStatusOrder ?? null,
    prevStatusOrder: item.prevStatusOrder ?? null,
    id: item.id,
    displayName: item.displayName,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    thumbnailUrl: item.thumbnailUrl ?? '',
})

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

        return jobStatusesData.map((item) => mapItem(item))
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
            return {} as TJobStatus
        }

        return mapItem(jobData)
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
            return {} as TJobStatus
        }

        return mapItem(jobData)
    }, [data])
    return {
        refetch,
        jobStatus: jobStatus,
        data: jobStatus,
        error,
        isLoading,
    }
}
