import { UserNotification } from '@/validationSchemas/notification.schema'

import { NOTIFICATION_API } from '../api'

export const getNotifications: () => Promise<UserNotification[]> = async () => {
    const res = await fetch(NOTIFICATION_API, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
