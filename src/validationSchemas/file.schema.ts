import * as yup from 'yup'

import { FileType } from '@/types/file.type'

export const fileItemSchema = yup.object({
    id: yup.string().required('ID is required'),
    name: yup.string().required('Name is required'),
    slug: yup.string().required('Slug is required'),
    type: yup.mixed<FileType>().required('Type is required'),
    size: yup.string().required('Size is required'),
    items: yup.number().integer().min(0).optional(),
    path: yup.array().of(yup.string().required()).required('Path is required'),
    visibleToUsers: yup
        .array()
        .of(yup.string().required())
        .required('Path is required'),
    createdById: yup.string().required(),
    createdAt: yup.string(),
    updatedAt: yup.string(),
})

// Type inference from the schema
export type FileItem = yup.InferType<typeof fileItemSchema>

// export type FileItem = {
//     id: string
//     name: string
//     type: FileType
//     size: string
//     items?: number
//     modified: Date
//     path: string[]
// }
