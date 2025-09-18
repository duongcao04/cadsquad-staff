
import { Job } from "./job.type"
import { FileSystem } from "./fileSystem.type"
import { RoleEnum } from "../enums/role.enum"
import { UserNotification } from "./userNotification.type"
import { Account } from "./account.type"
import { JobActivityLog } from "./jobActivityLog.type"

export interface User {
	id: string
	email: string
	username: string
	displayName: string
	password: string
	avatar?: string
	jobTitle?: string
	department?: string
	phoneNumber?: string
	role: RoleEnum
	isActive: boolean
	lastLoginAt?: Date
	notifications: UserNotification[]
	jobsAssigned: Job[]
	jobsCreated: Job[]
	filesCreated: FileSystem[]
	files: FileSystem[]
	createdAt: Date
	updatedAt: Date
	accounts: Account[]
	notificationsCreated: Notification[]
	JobActivityLog: JobActivityLog[]
}
