import { RoleEnum } from "../enums/_role.enum"
import { Account } from "./_account.interface"
import { Config } from "./_config.interface"
import { Department } from "./_department.interface"
import { Job } from "./_job.interface"
import { JobActivityLog } from "./_jobActivityLog.interface"
import { JobTitle } from "./_jobTitle.interface"

/**
 * Represents a user entity with profile details, relations,
 * and metadata about their activity in the system.
 */
export interface User {
	/** Unique identifier (UUIDv4) */
	id: string

	/** Unique email address */
	email: string

	/** Unique username */
	username: string

	/** Display name for the user profile */
	displayName: string

	/** Encrypted password */
	password: string

	/** Avatar URL (nullable) */
	avatar?: string | null

	/** Job title information (nullable) */
	jobTitleId?: string | null

	/** Job title information (nullable) */
	jobTitle?: JobTitle | null

	/** Department ID (nullable) */
	departmentId?: string | null

	/** Department information (nullable) */
	department?: Department | null

	/** Phone number (nullable) */
	phoneNumber?: string | null

	/** User role (e.g., ADMIN, USER) */
	role: RoleEnum

	/** Indicates if the user account is active */
	isActive: boolean

	/** Last login date and time (nullable) */
	lastLoginAt?: Date | null

	/** List of notifications received by the user */
	notifications: Notification[]

	/** List of jobs assigned to the user */
	jobsAssigned: Job[]

	/** List of jobs created by the user */
	jobsCreated: Job[]

	/** List of files created by the user */
	filesCreated: FileSystem[]

	/** List of files associated with the user */
	files: FileSystem[]

	/** Connected accounts (e.g., Google, GitHub) */
	accounts: Account[]

	/** Notifications sent by the user */
	sendedNotifications: Notification[]

	/** Log of job-related activities performed by the user */
	jobActivityLog: JobActivityLog[]

	/** Personal configuration settings for the user */
	configs: Config[]

	/** Date and time when the user was created */
	createdAt: Date

	/** Date and time when the user was last updated */
	updatedAt: Date
}
