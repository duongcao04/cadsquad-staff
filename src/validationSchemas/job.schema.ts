import * as yup from 'yup'

import {
    JobStatus as JobStatusPrisma,
    JobType as JobTypePrisma,
    Job as JobPrisma,
    JobActivityLog as JobActivityLogPrisma,
} from '@prisma/client'
import { User } from './user.schema'
import { PaymentChannel } from './paymentChannel.schema'

export type JobActivityLog = Partial<JobActivityLogPrisma> & {
    modifiedBy: User
}

export type Job = Partial<JobPrisma> & {
    status: Partial<JobStatus>
    memberAssign: User[]
    paymentChannel: PaymentChannel
}

export type JobStatus = Partial<JobStatusPrisma> & {
    _count: {
        jobs: number
    }
}

export type JobType = Partial<JobTypePrisma> & {
    jobs?: JobPrisma[]
    _count: {
        jobs: number
    }
}

export const CreateJobSchema = yup.object().shape({
    sourceUrl: yup.string(),
    jobNo: yup.string().required(),
    jobName: yup.string().required(),
    clientName: yup.string().required(),
    memberAssignIds: yup.array(yup.string().required()).required().min(1),
    paymentChannelId: yup.string().required(),
    jobTypeId: yup.string().required(),
    income: yup.number().required(),
    staffCost: yup.number().required(),
    completedAt: yup.string(),
    startedAt: yup.string().required(),
    dueAt: yup.string().required(),
})
export type NewJob = yup.InferType<typeof CreateJobSchema>
