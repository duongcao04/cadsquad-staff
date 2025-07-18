import * as yup from 'yup'

import { UserNotification as UserNotificationPrisma } from '@/generated/prisma'

export type UserNotification = UserNotificationPrisma & {
    title?: string
    content?: string
    image?: string
}

export const CreateNotificationSchema = yup.object().shape({
    recipientId: yup.string().required(),
    title: yup.string().required(),
    content: yup.string().required(),
})
export type NewNotification = yup.InferType<typeof CreateNotificationSchema>
