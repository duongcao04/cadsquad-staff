import * as yup from 'yup'

import {
    JobStatus as JobStatusPrisma,
    Project as ProjectPrisma,
} from '@/generated/prisma'

export type Project = Partial<ProjectPrisma> & {
    jobStatus: Partial<JobStatus>
}

export type JobStatus = Partial<JobStatusPrisma> & {
    _count: {
        projects: number
    }
}

export const CreateProjectSchema = yup.object().shape({
    sourceUrl: yup.string().required(),
    jobNo: yup.string().required(),
    jobName: yup.string().required(),
    memberAssignIds: yup.array(yup.string().required()).required().min(1),
    jobStatusId: yup.string().required(),
    price: yup.string().required(),
    startedAt: yup.string().required(),
    dueAt: yup.string().required(),
})
export type NewProject = yup.InferType<typeof CreateProjectSchema>
