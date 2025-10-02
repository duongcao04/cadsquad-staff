import * as yup from "yup"
import { NotificationType } from "@/shared/enums/notificationType.enum"
import { NotificationStatus } from "../enums/notificationStatus.enum"

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
        .mixed<NotificationType>()
        .oneOf(Object.values(NotificationType), `Type must be one of: ${Object.values(NotificationType).join(", ")}`)
        .required("Type is required"),

    userIds: yup
        .array(yup.string()
            .required("UserId is required")),
    userId: yup.string(),

    status: yup
        .mixed<NotificationStatus>()
        .oneOf(Object.values(NotificationStatus), `Status must be one of: ${Object.values(NotificationStatus).join(", ")}`)
})
export type CreateNotificationInput = yup.InferType<typeof CreateNotificationInputSchema>

export const UpdateNotificationInputSchema = CreateNotificationInputSchema.partial()

export type UpdateNotificationInput = yup.InferType<typeof UpdateNotificationInputSchema>