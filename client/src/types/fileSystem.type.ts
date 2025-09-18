import { Job } from "./job.type"
import { User } from "./user.type"

export interface FileSystem {
	id: string
	name: string
	type: string
	size: string
	items?: number
	path: string[]
	color?: string
	createdById: string
	createdBy: User
	visibleToUsers: User[]
	job?: Job
	jobId?: string
	createdAt: Date
	updatedAt: Date
}
