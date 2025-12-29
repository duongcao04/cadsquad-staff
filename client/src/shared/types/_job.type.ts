import type { IJobResponse } from '../interfaces'

export type JobColumn =
    | 'no'
    | 'type'
    | 'thumbnail'
    | 'displayName'
    | 'description'
    | 'attachmentUrls'
    | 'clientName'
    | 'incomeCost'
    | 'staffCost'
    | 'assignee'
    | 'paymentChannel'
    | 'status'
    | 'isPaid'
    | 'dueAt'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'action'

export type JobColumnKey =
    | 'no'
    | 'type'
    | 'thumbnailUrl'
    | 'displayName'
    | 'description'
    | 'attachmentUrls'
    | 'clientName'
    | 'incomeCost'
    | 'staffCost'
    | 'assignee'
    | 'paymentChannel'
    | 'status'
    | 'isPaid'
    | 'dueAt'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'action'

export type TJob = Omit<
    IJobResponse,
    'typeId' | 'createdById' | 'paymentChannelId' | 'statusId'
>

export type JobUpdateResponse = { id: string; no: string }
