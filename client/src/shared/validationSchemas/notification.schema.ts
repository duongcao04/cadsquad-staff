import * as yup from "yup"
import { NotificationType } from "@/shared/enums/notificationType.enum"

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

    userId: yup
        .string()
        .required("UserId is required"),
})
export type CreateNotificationInput = yup.InferType<typeof CreateNotificationInputSchema>

export const UpdateNotificationInputSchema = CreateNotificationInputSchema.partial()

export type UpdateNotificationInput = yup.InferType<typeof UpdateNotificationInputSchema>