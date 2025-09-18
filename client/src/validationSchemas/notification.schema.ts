import * as yup from "yup"
import { NotificationType } from "../enums/notificationType.enum"

export const CreateNotificationSchema = yup.object({
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
export type CreateNotificationInput = yup.InferType<typeof CreateNotificationSchema>