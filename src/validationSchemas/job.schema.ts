import * as yup from 'yup'

import {
    JobStatus as JobStatusPrisma,
    JobType as JobTypePrisma,
    PaymentChannel as PaymentChannelPrisma,
    Job as JobPrisma,
    User,
} from '@prisma/client'

export type Job = Partial<JobPrisma> & {
    jobStatus: Partial<JobStatus>
    memberAssign: User[]
    paymentChannel: PaymentChannel
}

export type JobStatus = Partial<JobStatusPrisma> & {
    _count: {
        projects: number
    }
}

export type JobType = Partial<JobTypePrisma> & {
    jobs?: JobPrisma[]
    _count: {
        jobs: number
    }
}

export type PaymentChannel = Partial<PaymentChannelPrisma> & {
    jobs?: Job[]
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
    createdById: yup.number().required(),
    jobTypeId: yup.string().required(),
    income: yup.number().required(),
    staffCost: yup.number().required(),
    completedAt: yup.string(),
    startedAt: yup.string().required(),
    dueAt: yup.string().required(),
})
export type NewJob = yup.InferType<typeof CreateJobSchema>
