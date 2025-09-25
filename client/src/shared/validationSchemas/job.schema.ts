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
    sourceUrl: yup
        .string()
        .url("sourceUrl must be a valid URL")
        .optional(),
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
        .of(yup.string().uuid("Each assignee must be a valid UUID"))
        .optional(),
    createdById: yup
        .string()
        .uuid("Invalid createdById format")
        .required("CreatedById is required"),
    paymentChannelId: yup
        .string()
        .uuid("Invalid paymentChannelId format")
        .required("PaymentChannelId is required"),
    statusId: yup
        .string()
        .uuid("Invalid statusId format")
        .required("StatusId is required"),
    startedAt: yup
        .date()
        .optional(),
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
        .required("Due date is required")
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

export const JobQuerySchema = yup.object({
    tab: yup.string().optional(),
    search: yup.string().optional(),
    hideFinishItems: yup.number().optional(),
    limit: yup.number().optional(),
    page: yup.number().optional(),
});
export type JobQueryInput = yup.InferType<typeof JobQuerySchema>;

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

