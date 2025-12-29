import type { IJobActivityLogResponse } from '../interfaces'

export type TJobActivityLog = Omit<
    IJobActivityLogResponse,
    'jobId' | 'modifiedById'
>
