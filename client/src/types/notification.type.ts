import { NotificationType } from "../enums/notificationType.enum"
import { User } from "./user.type"
import { UserNotification } from "./userNotification.type"

export interface Notification {
	id: string
	title?: string
	content: string
	imageUrl?: string
	senderId?: string
	sender?: User
	type: NotificationType
	createdAt: Date
	updatedAt: Date
	userNotification: UserNotification[]
	userId: string
}
