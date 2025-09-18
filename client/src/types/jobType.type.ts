import { Job } from "./job.type"

export interface JobType {
	id: string
	code: string
	displayName: string
	hexColor?: string
	jobs: Job[]
}
