import { User } from "./user.type"
import { Notification } from "./notification.type"
import { NotificationStatus } from "../enums/notificationStatus.enum"

export interface UserNotification {
	id: string
	user: User
	userId: string
	notification: Notification
	notificationId: string
	status: NotificationStatus
	createdAt: Date
}
