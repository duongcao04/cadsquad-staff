import { JobPriority } from "../enums/jobPriority.enum"
import { JobActivityLog } from "./jobActivityLog.type"
import { JobStatus } from "./jobStatus.type"
import { JobType } from "./jobType.type"
import { PaymentChannel } from "./paymentChannel.type"
import { User } from "./user.type"

export interface Job {
	id: string
	no: string
	type: JobType
	typeId: string
	displayName: string
	description?: string
	sourceUrl?: string
	clientName: string
	incomeCost: number
	staffCost: number
	assignee: User[]
	createdBy: User
	createdById: string
	paymentChannel: PaymentChannel
	paymentChannelId: string
	status: JobStatus
	statusId: string
	activityLog: JobActivityLog[]
	startedAt: Date
	priority: JobPriority
	files: FileSystem[]
	isPinned: boolean
	isPublished: boolean
	isPaid: boolean
	dueAt: Date
	completedAt?: Date
	deletedAt?: Date
	createdAt: Date
	updatedAt: Date
}
