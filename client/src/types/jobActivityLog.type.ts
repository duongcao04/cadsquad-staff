import { ActivityType } from "../enums/activityType.enum"
import { Job } from "./job.type"
import { User } from "./user.type"

export interface JobActivityLog {
	id: string
	job: Job
	jobId: string
	previousValue?: string
	currentValue?: string
	modifiedAt: Date
	modifiedBy: User
	modifiedById: string
	fieldName: string
	activityType: ActivityType
	notes?: string
}
