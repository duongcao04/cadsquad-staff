import type { IJobResponse } from '../interfaces'

export type JobColumnKey =
    | 'thumbnailUrl'
    | 'clientName'
    | 'type'
    | 'no'
    | 'description'
    | 'displayName'
    | 'incomeCost'
    | 'totalStaffCost'
    | 'staffCost'
    | 'status'
    | 'dueAt'
    | 'attachmentUrls'
    | 'assignments'
    | 'isPaid'
    | 'paymentChannel'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'action'

export type TJob = Omit<
    IJobResponse,
    'typeId' | 'createdById' | 'paymentChannelId' | 'statusId'
>

export type JobUpdateResponse = { id: string; no: string }
