import * as yup from 'yup'

import {
    Notification as NotificationPrisma,
    UserNotification as UserNotificationPrisma,
} from '@/generated/prisma'

export type Notification = NotificationPrisma
export type UserNotification = UserNotificationPrisma & {
    title?: string
    content?: string
    image?: string
    notification: Notification
}

export const CreateNotificationSchema = yup.object().shape({
    recipientId: yup.string().required(),
    title: yup.string().required(),
    content: yup.string().required(),
    image: yup.string().nullable(),
})
export type NewNotification = yup.InferType<typeof CreateNotificationSchema>
