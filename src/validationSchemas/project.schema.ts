import * as yup from 'yup'

export const ProjectSchema = yup.object().shape({
    id: yup.string(),
    thumbnail: yup.string(),
    sourceUrl: yup.string(),
    jobNo: yup.string(),
    jobName: yup.string(),
    status: yup.string(),
    price: yup.string(),
    startedAt: yup.string(),
    dueAt: yup.string(),
    createdAt: yup.string(),
    updatedAt: yup.string(),
})
export type Project = yup.InferType<typeof ProjectSchema>
