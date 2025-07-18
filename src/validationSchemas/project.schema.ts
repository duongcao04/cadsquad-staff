import * as yup from 'yup'

import {
    JobStatus as JobStatusPrisma,
    JobType as JobTypePrisma,
    PaymentChannel as PaymentChannelPrisma,
    Project as ProjectPrisma,
    User,
} from '@/generated/prisma'

export type Project = Partial<ProjectPrisma> & {
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
    projects?: Project[]
    _count: {
        projects: number
    }
}

export type PaymentChannel = Partial<PaymentChannelPrisma> & {
    projects?: Project[]
    _count: {
        projects: number
    }
}

export const CreateProjectSchema = yup.object().shape({
    sourceUrl: yup.string().required(),
    jobNo: yup.string().required(),
    jobName: yup.string().required(),
    clientName: yup.string().required(),
    memberAssignIds: yup.array(yup.string().required()).required().min(1),
    jobStatusId: yup.string().required(),
    paymentChannelId: yup.string().required(),
    createdById: yup.string().required(),
    jobTypeId: yup.string().required(),
    income: yup.number().required(),
    staffCost: yup.number().required(),
    startedAt: yup.string().required(),
    dueAt: yup.string().required(),
})
export type NewProject = yup.InferType<typeof CreateProjectSchema>
