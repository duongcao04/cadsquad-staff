import { isValid, parseISO } from 'date-fns'
import * as yup from 'yup'
import { z } from 'zod'

import { ProjectCenterTabEnum } from '../../shared/enums'
import { arrayToString, optionalIsoDate } from '../zod'

export const CreateJobSchema = yup.object({
    no: yup.string().required('Job number is required'),
    typeId: yup
        .string()
        .uuid('Invalid typeId format')
        .required('Job type is required'),
    displayName: yup.string().required('Display name is required'),
    description: yup.string().optional(),
    attachmentUrls: yup.array(yup.string().required()).optional(),
    clientName: yup.string().required('Client name is required'),
    incomeCost: yup.number().required('Income cost is required'),
    staffCost: yup.number().required('Staff cost is required'),
    assigneeIds: yup.array().of(yup.string().required()).optional(),
    paymentChannelId: yup.string().nullable(),
    priority: yup
        .string()
        .oneOf(
            ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            'Priority must be one of: LOW, MEDIUM, HIGH, URGENT'
        )
        .optional(),
    isPinned: yup.boolean().optional(),
    isPublished: yup.boolean().optional(),
    isPaid: yup.boolean().optional(),
    startedAt: yup
        .string()
        .required('Started at is required')
        .test('is-iso-string', 'Date must be a valid ISO string', (value) => {
            // If the field is empty or null, other validations (like .required()) handle it
            if (!value) return true

            const parsedDate = parseISO(value)
            // Check if it's a valid date object after parsing
            return isValid(parsedDate)
        }),
    dueAt: yup
        .string()
        .required('Due date is required')
        .test('is-iso-string', 'Date must be a valid ISO string', (value) => {
            if (!value) return true
            const parsedDate = parseISO(value)
            return isValid(parsedDate)
        })
        .test('is-future', 'Due date cannot be in the past', (value) => {
            if (!value) return true
            const parsedDate = parseISO(value)

            // If the date is invalid, we return true here so the 'is-iso-string'
            // error shows instead of this one.
            if (!isValid(parsedDate)) return true

            // Check if date is in the future
            return parsedDate > new Date()
        }),
})
export type TCreateJobInput = yup.InferType<typeof CreateJobSchema>

export const UpdateJobSchema = CreateJobSchema.partial()
export type TUpdateJobInput = yup.InferType<typeof UpdateJobSchema>

// ---------------------------------------------------------------
// QUERY SCHEMAS
// ---------------------------------------------------------------
// 1. JobFiltersSchema
export const JobFiltersSchema = z.object({
    clientName: z.string().trim().optional(),

    // Array Filters (handling CSV string or Array input)
    type: arrayToString,
    status: arrayToString,
    assignee: arrayToString,
    paymentChannel: arrayToString,

    // Date Range Filters
    createdAtFrom: optionalIsoDate,
    createdAtTo: optionalIsoDate,
    dueAtFrom: optionalIsoDate,
    dueAtTo: optionalIsoDate,
    completedAtFrom: optionalIsoDate,
    completedAtTo: optionalIsoDate,
    finishedAtFrom: optionalIsoDate,
    finishedAtTo: optionalIsoDate,

    // Cost Filters (DTO expects String, but usually represents a Number)
    incomeCostMin: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric string')
        .optional(),
    incomeCostMax: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric string')
        .optional(),
    staffCostMin: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric string')
        .optional(),
    staffCostMax: z
        .string()
        .regex(/^\d+$/, 'Must be a numeric string')
        .optional(),
})

// 2. JobSortSchema
export const JobSortSchema = z.object({
    sort: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .default(['displayName:asc'])
        .transform((val) => {
            if (Array.isArray(val)) return val
            return val ? val.split(',') : ['displayName:asc']
        }),
})

// 3. JobQuerySchema (Combines Filters, Sorts, and Base Query)
export const JobQuerySchema = JobFiltersSchema.merge(JobSortSchema).extend({
    tab: z
        .nativeEnum(ProjectCenterTabEnum)
        .optional()
        .default(ProjectCenterTabEnum.ACTIVE),

    search: z.string().trim().optional(),

    hideFinishItems: z.enum(['0', '1']).optional().default('0'),

    isAll: z.enum(['0', '1']).optional().default('0'),

    // Pagination (Using coerce to handle URL query string numbers)
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),

    page: z.coerce.number().int().min(1).optional().default(1),
})

// Types inferred from Schemas (Optional, but useful for frontend type safety)
export type TJobFiltersInput = z.input<typeof JobFiltersSchema>
export type TJobQueryInput = z.input<typeof JobQuerySchema> // Raw input (e.g. from URLSearchParams)
export type TJobQueryOutput = z.output<typeof JobQuerySchema> // Transformed output (e.g. ready for API call)

// ---------------------------------------------------------------
// MUTATION SCHEMAS
// ---------------------------------------------------------------

export const BulkChangeStatusInputSchema = z.object({
    jobIds: z.array(z.string()).min(1, 'jobIds must contain at least one id'),
    toStatusId: z.string().min(1, 'toStatusId is required'),
})

export type TBulkChangeStatusInput = z.infer<typeof BulkChangeStatusInputSchema>

export const UpdateJobMembersSchema = yup.object({
    prevMemberIds: yup.string().required(),
    updateMemberIds: yup.string().required(),
})
export type TUpdateJobMembersInput = yup.InferType<
    typeof UpdateJobMembersSchema
>

export const RescheduleJobSchema = yup.object({
    fromDate: yup.string().required(),
    toDate: yup.string().required(),
})
export type TRescheduleJob = yup.InferType<typeof RescheduleJobSchema>
