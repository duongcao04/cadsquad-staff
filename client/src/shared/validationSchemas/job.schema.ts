import * as yup from 'yup'

export const CreateJobSchema = yup.object({
    no: yup
        .string()
        .required("Job number is required"),
    typeId: yup
        .string()
        .uuid("Invalid typeId format")
        .required("Job type is required"),
    displayName: yup
        .string()
        .required("Display name is required"),
    description: yup
        .string()
        .optional(),
    attachmentUrls: yup.array(yup.string().required()).optional(),
    clientName: yup
        .string()
        .required("Client name is required"),
    incomeCost: yup
        .number()
        .integer("Income cost must be an integer")
        .required("Income cost is required"),
    staffCost: yup
        .number()
        .integer("Staff cost must be an integer")
        .required("Staff cost is required"),
    assigneeIds: yup
        .array()
        .of(yup.string().required())
        .optional(),
    createdById: yup
        .string()
        .uuid("Invalid createdById format")
        .required("CreatedById is required"),
    paymentChannelId: yup
        .string().nullable(),
    startedAt: yup
        .date()
        .min(new Date(), "Start date cannot be in the past"),
    priority: yup
        .string()
        .oneOf(["LOW", "MEDIUM", "HIGH", "URGENT"], "Priority must be one of: LOW, MEDIUM, HIGH, URGENT")
        .optional(),
    isPinned: yup
        .boolean()
        .optional(),
    isPublished: yup
        .boolean()
        .optional(),
    isPaid: yup
        .boolean()
        .optional(),
    dueAt: yup
        .date()
        .min(new Date(), "Due date cannot be in the past"),
    completedAt: yup
        .date()
        .optional(),
    deletedAt: yup
        .date()
        .optional(),
})
export type CreateJobInput = yup.InferType<typeof CreateJobSchema>

export const UpdateJobSchema = CreateJobSchema.partial()
export type UpdateJobInput = yup.InferType<typeof UpdateJobSchema>

export const JobFiltersSchema = yup.object({
    clientName: yup.array().of(yup.string().required()).optional(), // Client names split as ","
    type: yup.array().of(yup.string().required()).optional(), // Job type codes split as ","
    status: yup.array().of(yup.string().required()).optional(), // Status codes split as ","
    assignee: yup.array().of(yup.string().required()).optional(), // Assignee username split as ","
    paymentChannel: yup.array().of(yup.string().required()).optional(), // Payment channel codes split as ","
    incomeCostMin: yup.string().optional(),
    incomeCostMax: yup.string().optional(),
    staffCostMin: yup.string().optional(),
    staffCostMax: yup.string().optional(),
    dueAtFrom: yup.string().optional(),
    dueAtTo: yup.string().optional(),
    completedAtFrom: yup.string().optional(),
    completedAtTo: yup.string().optional(),
    createdAtFrom: yup.string().optional(),
    createdAtTo: yup.string().optional(),
    updatedAtFrom: yup.string().optional(),
    updatedAtTo: yup.string().optional(),
    finishedAtFrom: yup.string().optional(),
    finishedAtTo: yup.string().optional(),
});
export type JobFiltersInput = yup.InferType<typeof JobFiltersSchema>;

export const JobQuerySchema = yup.object({
    tab: yup.string().optional(),
    search: yup.string().optional(),
    hideFinishItems: yup.number().optional(),
    limit: yup.number().optional(),
    page: yup.number().optional(),
    sort: yup.string().optional(),
});
export type JobQueryInput = yup.InferType<typeof JobQuerySchema>;

export const JobQueryWithFiltersSchema = JobQuerySchema.concat(JobFiltersSchema)
export type JobQueryWithFiltersInput = yup.InferType<typeof JobQueryWithFiltersSchema>;

export const ChangeStatusSchema = yup.object({
    fromStatusId: yup.string().required(),
    toStatusId: yup.string().required(),
});
export type ChangeStatusInput = yup.InferType<typeof ChangeStatusSchema>;

export const UpdateJobMembersSchema = yup.object({
    prevMemberIds: yup.string().required(),
    updateMemberIds: yup.string().required(),
});
export type UpdateJobMembersInput = yup.InferType<typeof UpdateJobMembersSchema>;

