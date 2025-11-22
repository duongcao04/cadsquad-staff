import { IUserNotificationResponse } from "../interfaces";

export type TUserNotification = Omit<IUserNotificationResponse, 'userId' | 'senderId'>