import { JobStatusSystemTypeEnum } from '@/shared/enums'
import type { IJobStatusResponse } from '@/shared/interfaces'
import type { TJobStatus } from '@/shared/types'
import { queryOptions } from '@tanstack/react-query'
import { jobStatusApi } from '../../api'
import lodash from 'lodash'

export const mapJobStatus: (item: IJobStatusResponse) => TJobStatus = (
    item
) => ({
    code: item.code ?? '',
    hexColor: item.hexColor ?? '#ffffff',
    systemType: item.systemType ?? JobStatusSystemTypeEnum.STANDARD,
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


export const jobStatusesListOptions = () => {
    return queryOptions({
        queryKey: ['job-statuses'],
        queryFn: () => jobStatusApi.findAll(),
        select: (res) => {
            const jobStatusesData = res?.result
            return {
                jobStatuses: Array.isArray(jobStatusesData)
                    ? jobStatusesData.map(mapJobStatus)
                    : []
            }
        },
    })
}

export const statusByOrderOptions = (order: number) =>
    queryOptions({
        queryKey: ['job-statuses', 'order', order],
        queryFn: () => jobStatusApi.findByOrder(order),
        select: (res) => {
            const statusData = res?.result
            return lodash.isEmpty(statusData) ? undefined : mapJobStatus(statusData)
        },
    })

