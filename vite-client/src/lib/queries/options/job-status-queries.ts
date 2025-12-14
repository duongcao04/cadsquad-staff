import { JobStatusSystemTypeEnum } from '@/shared/enums'
import type { IJobStatusResponse } from '@/shared/interfaces'
import type { TJobStatus } from '@/shared/types'

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
