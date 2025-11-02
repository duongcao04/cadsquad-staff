import { NotificationStatusEnum, NotificationTypeEnum } from "@/shared/enums"
import * as yup from "yup"

export const CreateNotificationInputSchema = yup.object({
    title: yup
        .string()
        .optional(),

    content: yup
        .string()
        .required("Content is required"),

    imageUrl: yup
        .string()
        .optional(),

    senderId: yup
        .string()
        .optional(),

    type: yup
        .mixed<NotificationTypeEnum>()
        .oneOf(Object.values(NotificationTypeEnum), `Type must be one of: ${Object.values(NotificationTypeEnum).join(", ")}`)
        .required("Type is required"),

    userIds: yup
        .array(yup.string()
            .required("UserId is required")),
    userId: yup.string(),

    status: yup
        .mixed<NotificationStatusEnum>()
        .oneOf(Object.values(NotificationStatusEnum), `Status must be one of: ${Object.values(NotificationStatusEnum).join(", ")}`)
})
export type CreateNotificationInput = yup.InferType<typeof CreateNotificationInputSchema>

export const UpdateNotificationInputSchema = CreateNotificationInputSchema.partial()

export type UpdateNotificationInput = yup.InferType<typeof UpdateNotificationInputSchema>